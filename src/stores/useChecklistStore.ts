import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Checklist, ClReport } from "../types";

type ChecklistStore = {
  report: ClReport;
  setClReport: <T extends keyof ClReport>(key: T, value: ClReport[T]) => void;
  addChecklist: (checklist: Checklist) => void;
  removeChecklist: (clTermporalId: string) => void;
  updateReportHeader: (data: Partial<ClReport>) => void;
  resetReport: () => void;
  fillReportByApi: (reportData: ClReport) => void;
};

export const ITEMS = [
  {
    id: 1,
    img: "/assets/oil.png",
    name: "Oil",
    choices: ["1/4", "1/2", "3/4", "Full", "N/A"],
    default: "Full",
  },
  {
    id: 2,
    img: "/assets/hydraulic.png",
    name: "Hydraulic",
    choices: ["1/4", "1/2", "3/4", "Full", "N/A"],
    default: "Full",
  },
  {
    id: 3,
    img: "/assets/filter.png",
    name: "Filter",
    choices: ["Clean", "Dirty", "N/A"],
    default: "",
  },
  {
    id: 4,
    img: "/assets/radiator.png",
    name: "Radiator",
    choices: ["Clean", "Dirty", "N/A"],
    default: "Clean",
  },
  {
    id: 5,
    img: "/assets/track.png",
    name: "Track",
    choices: ["Damage", "Ready", "N/A"],
    default: "Ready",
  },
  {
    id: 6,
    img: "/assets/attachment.webp",
    name: "Attachment",
    choices: ["Damage", "Ready", "N/A"],
    default: "Ready",
  },
  {
    id: 7,
    img: "/assets/leaking.png",
    name: "Leaking",
    choices: ["Yes", "No", "N/A"],
    default: "No",
  },
  {
    id: 8,
    img: "/assets/diesel.png",
    name: "Diesel",
    choices: ["1/4", "1/2", "3/4", "Full", "N/A"],
    default: "Full",
  },
  {
    id: 9,
    img: "/assets/clean.png",
    name: "Clean",
    choices: ["Yes", "No", "N/A"],
    default: "Yes",
  },
];

const initialData = (): ClReport => ({
  equipmentsGoogleChecklistsId: null,
  jobsId: 0,
  userName: "",
  date: new Date().toISOString().split("T")[0],
  checklists: [],
});

const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      report: initialData(),

      setClReport: (key, value) =>
        set((state) => ({
          report: { ...state.report, [key]: value },
        })),

      addChecklist: (newChecklist) =>
        set((state) => {
          const currentChecklists = state.report?.checklists || [];
          const otherChecklists = currentChecklists.filter(
            (item) => item.temporalId !== newChecklist.temporalId,
          );

          return {
            report: {
              ...state.report,
              checklists: [...otherChecklists, newChecklist],
            },
          };
        }),

      removeChecklist: (clTemporalId) =>
        set((state) => {
          const currentChecklists = state.report?.checklists || [];
          return {
            report: {
              ...state.report,
              checklists: currentChecklists.filter(
                (cl) => cl.temporalId !== clTemporalId,
              ),
            },
          };
        }),

      updateReportHeader: (data) =>
        set((state) => ({
          report: { ...state.report, ...data },
        })),

      resetReport: () => set({ report: initialData() }),

      fillReportByApi: (reportData) => set({ report: reportData }),
    }),
    {
      name: "checklist-storage",
    },
  ),
);

export default useChecklistStore;
