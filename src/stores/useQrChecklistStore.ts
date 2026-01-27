import { create } from "zustand";
import type { QrChecklist } from "../types";
import { persist } from "zustand/middleware";

type QrChecklistStore = {
  qrClAdded: number[];
  qrClDeleted: number[];
  showQrClModal: boolean;
  setShowQrClModal: (show: boolean) => void;
  addQrChecklist: (checklist: QrChecklist) => void;
  deleteQrChecklists: (checklist: QrChecklist) => void;
  reset: () => void;
};

const useQrChecklistStore = create<QrChecklistStore>()(
  persist(
    (set) => ({
      qrClAdded: [],
      qrClDeleted: [],
      showQrClModal: false,
      setShowQrClModal: (show) => set({ showQrClModal: show }),
      addQrChecklist: (newChecklist) =>
        set((state) => {
          const otherQrCl = state.qrClAdded.filter(
            (item) => item !== newChecklist.checklistsId,
          );

          return {
            qrClAdded: [...otherQrCl, newChecklist.checklistsId],
          };
        }),
      deleteQrChecklists: (checklist) =>
        set((state) => {
          const currentCls = state.qrClDeleted.filter(
            (item) => item !== checklist.checklistsId,
          );

          return {
            qrClDeleted: [...currentCls, checklist.checklistsId],
          };
        }),
      reset: () => set({ qrClAdded: [], qrClDeleted: [] }),
    }),
    {
      name: "qrChecklists-storage",
    },
  ),
);

export default useQrChecklistStore;
