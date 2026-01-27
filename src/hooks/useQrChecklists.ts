import { useQuery } from "@tanstack/react-query";
import type { QrChecklist } from "../types";
import { api } from "./apiConfig";

const queryQrChecklists = async (
  jobId: number,
  date: string,
): Promise<QrChecklist[]> => {
  const { data } = await api.get<QrChecklist[]>(
    `v1/qrChecklists/${jobId}/by-date`,
    { params: { date } },
  );
  return data;
};

function useQrChecklists(jobId: number, date: string) {
  return useQuery({
    queryKey: ["qrChecklist", jobId, date],
    queryFn: () => queryQrChecklists(jobId!, date),
    enabled: !!jobId && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

export default useQrChecklists;
