import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  EquipmentIssueCreateDto,
  Issue,
} from "../types";
import { api } from "./apiConfig";

const createIssue = async (issueData: Issue) => {
  const { data } = await api.post("v1/issue", issueData);
  return data;
};

const createIssueMaintenance = async (payload: EquipmentIssueCreateDto) => {
  const { data } = await api.post("/v2/maintenance/issue", payload);
  return data;
};

export function useSaveIssue() {
  const queryClient = useQueryClient();

  const issueMutation = useMutation({ mutationFn: createIssue });
  const maintenanceMutation = useMutation({
    mutationFn: createIssueMaintenance,
  });

  const saveIssueProcess = async (
    issueData: Issue,
    maintenancePayload: EquipmentIssueCreateDto,
  ) => {
    let createdIssueId: number | null = null;

    try {
      // Paso 1: Crear Issue principal
      const issueResponse = await issueMutation.mutateAsync(issueData);

      // Extraer ID generado
      createdIssueId = issueResponse.equipmentsIssuesId || issueResponse.id;

      // Paso 2: Crear registro en Mantenimiento vinculando el ID
      if (createdIssueId) {
        const payload: EquipmentIssueCreateDto = {
          ...maintenancePayload,
          issueData: {
            ...maintenancePayload.issueData,
            referenceID: createdIssueId,
          },
        };

        await maintenanceMutation.mutateAsync(payload);
      }

      // Paso 3: Invalidar caché tras éxito total
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });

      return issueResponse;
    } catch (error) {
      // Paso 4: Compensación (Rollback) si falla la segunda llamada
      if (createdIssueId) {
        try {
          console.warn(
            "Fallo el servicio de mantenimiento. Eliminando issue creado...",
          );
        } catch (rollbackError) {
          console.error(
            "Error crítico: Falló el rollback en el primer servicio",
            rollbackError,
          );
        }
      }

      throw error;
    }
  };

  return {
    saveIssueProcess,
    isPending: issueMutation.isPending || maintenanceMutation.isPending,
    isError: issueMutation.isError || maintenanceMutation.isError,
    error: issueMutation.error || maintenanceMutation.error,
  };
}
