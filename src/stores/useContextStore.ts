import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppContext {
  jobId: number | null;
  checklistId: number | null;
  isLoaded: boolean;
  setIds: (jobId: number | null, checklistId: number | null) => void;
  setIsLoaded: (loaded: boolean) => void;
}

export const useContextStore = create<AppContext>()(
  persist(
    (set) => ({
      jobId: null,
      checklistId: null,
      isLoaded: false,

      setIds: (jobId, checklistId) => set({ jobId, checklistId }),
      setIsLoaded: (loaded) => set({ isLoaded: loaded }),
    }),
    {
      name: "app-context-storage",
    },
  ),
);
