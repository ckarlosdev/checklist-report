import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Checklist } from "../types";

type EquipmentClStore = {
  checklist: Checklist;
  setChecklistData: <T extends keyof Checklist>(
    key: T,
    value: Checklist[T],
  ) => void;
  setFullChecklist: (checklistUpdate: Checklist) => void;
  resetChecklist: () => void;
  setSelectedOption: (name: string, value: string) => void;
};

const getInitialData = (): Checklist => ({
  temporalId: crypto.randomUUID(),
  googleChecklistsId: null,
  equipmentsId: null,
  equipmentName: "",
  employeesId: null,
  odometer: "0",
  selectedOptions: [
    { name: "Oil", selectedValue: "" },
    { name: "Hydraulic", selectedValue: "" },
    { name: "Filter", selectedValue: "" },
    { name: "Radiator", selectedValue: "" },
    { name: "Track", selectedValue: "" },
    { name: "Attachment", selectedValue: "" },
    { name: "Leaking", selectedValue: "" },
    { name: "Diesel", selectedValue: "" },
    { name: "Clean", selectedValue: "" },
  ],
  comment: "",
  otherType: "Owner",
});

const useEquipmentClStore = create<EquipmentClStore>()(
  persist(
    (set) => ({
      checklist: getInitialData(),
      setChecklistData: (key, value) =>
        set((state) => ({
          checklist: {
            ...state.checklist,
            [key]: value,
          },
        })),

      setFullChecklist: (checklistUpdate) =>
        set({
          checklist: checklistUpdate,
        }),

      resetChecklist: () => set(() => ({ checklist: getInitialData() })),
      setSelectedOption: (name, selectedValue) =>
        set((state) => {
          const { selectedOptions } = state.checklist;

          // Buscamos si la opción ya existe en el array
          const exists = selectedOptions.some((opt) => opt.name === name);

          const newOptions = exists
            ? selectedOptions.map((opt) =>
                opt.name === name ? { ...opt, selectedValue } : opt,
              )
            : [...selectedOptions, { name, selectedValue }];

          return {
            checklist: { ...state.checklist, selectedOptions: newOptions },
          };
        }),
    }),
    {
      name: "equipmentCl-storage",
    },
  ),
);

export default useEquipmentClStore;
