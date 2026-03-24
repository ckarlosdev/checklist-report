import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Issue, QrChecklist } from "../types";

type issueStore = {
  issue: Issue;
  qrChecklist: QrChecklist | null;
  showIssueModal: boolean;

  setChecklist: (checklist: QrChecklist) => void;
  setIssueData: <K extends keyof Issue>(key: K, value: Issue[K]) => void;
  setShowIssueModal: (show: boolean) => void;
  reset: () => void;
};

const initialData = {
  checklistsId: null,
  equipmentsId: null,
  flow: "",
  reportedBy: "",
  reportedDate: "",
  priorityIssue: "",
  typeIssue: "",
  descriptionIssue: "",
  details: "",
  createdBy: "",
  updatedBy: "",
};

const useIssueStore = create<issueStore>()(
  persist(
    (set) => ({
      issue: initialData,
      qrChecklist: null,
      showIssueModal: false,

      setChecklist: (checklist) =>
        set((state) => ({
          ...state, // Opcional pero recomendado si tienes persistencia compleja
          qrChecklist: { ...checklist }, // Creamos una copia nueva para forzar el cambio de referencia
        })),
      setIssueData: (key, value) =>
        set((state) => ({
          issue: {
            ...state.issue,
            [key]: value,
          },
        })),
      setShowIssueModal: (show) => set({ showIssueModal: show }),
      reset: () =>
        set(() => ({
          issue: initialData,
        })),
    }),
    {
      name: "qrChecklists-storage",
    },
  ),
);

export default useIssueStore;
