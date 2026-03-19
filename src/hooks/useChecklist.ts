import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiConfig";
import type { apiClReport } from "../types";
import { useContextStore } from "../stores/useContextStore";

const queryChecklist = async (checklistId: number): Promise<apiClReport> => {
  const { data } = await api.get(`v1/cl/${checklistId}`);
  return data;
};

export function useChecklist(checklistId: number) {
  return useQuery({
    queryKey: ["checklist", checklistId],
    queryFn: () => queryChecklist(checklistId),
    enabled: !!checklistId,
    retry: false,
  });
}

const createChecklist = async ({ reportData }: { reportData: any }) => {
  if (reportData.equipmentsGoogleChecklistsId) {
    return api.put(`v1/checkLists`, reportData);
  }
  return api.post(`v1/checkLists`, reportData);
};

export function useSaveChecklist() {
  const queryClient = useQueryClient();
  const jobId = useContextStore((s) => s.jobId);

  return useMutation({
    mutationKey: ["save-report"],
    mutationFn: createChecklist,
    onSuccess: (response) => {
      const newId = response.data.equipmentsGoogleChecklistsId;
      queryClient.invalidateQueries({ queryKey: ["save-report", newId] });
      alert("Data saved succesfully.");
      window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
    },
    onError: () => {
      alert("Error saving data");
    },
  });
}
