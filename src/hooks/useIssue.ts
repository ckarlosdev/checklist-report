import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Issue } from "../types";
import { api } from "./apiConfig";

const createIssue = async ({ issueData }: { issueData: Issue }) => {
  return api.post(`v1/issue`, issueData);
};

export function useSaveIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}
