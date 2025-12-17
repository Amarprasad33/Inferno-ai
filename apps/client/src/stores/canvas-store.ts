import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  createCanvas,
  deleteCanvas,
  getCanvas,
  listCanvases,
  updateCanvasTitle,
  type Canvas,
  type CanvasDetail,
} from "@/lib/canvas-api";
// import { toast } from "sonner";

type CanvasState = {
  canvases: Canvas[];
  currentCanvas: CanvasDetail | null;
  loading: boolean;
  error: string | null;
  selectedCanvasId: string | null;
  setSelectedCanvasId: (id: string | null) => void;
  loadCanvases: () => Promise<void>;
  loadCanvas: (id: string) => Promise<void>;
  createCanvas: (title?: string) => Promise<Canvas>;
  deleteCanvas: (id: string) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
  resetCurrentCanvas: () => void;
};

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      (set) => ({
        canvases: [],
        currentCanvas: null,
        loading: false,
        error: null,
        selectedCanvasId: null,
        setSelectedCanvasId: (id) => set({ selectedCanvasId: id }),
        loadCanvases: async () => {
          set({ loading: true, error: null });
          try {
            const res = await listCanvases();
            set({ canvases: res.canvases });
          } catch (err) {
            console.error("Failed to load canvases:", err);
            set({ error: "Failed to load canvases" });
          } finally {
            set({ loading: false });
          }
        },
        loadCanvas: async (id: string) => {
          set({ loading: true, error: null });
          try {
            const detail = await getCanvas(id);
            console.log("detail", detail);
            set({ currentCanvas: detail });
          } catch (err) {
            console.error("Failed to load canvas:", err);
            set({ error: "Failed to load canvas" });
          } finally {
            set({ loading: false });
          }
        },
        createCanvas: async (title?: string) => {
          set({ loading: true, error: null });
          try {
            const newCanvas = await createCanvas({ title });
            set((state) => ({
              canvases: [newCanvas, ...state.canvases],
              selectedCanvasId: newCanvas.id,
            }));
            return newCanvas;
          } catch (err) {
            console.error("Failed to create canvas:", err);
            set({ error: "Failed to create canvas" });
            throw err;
          } finally {
            set({ loading: false });
          }
        },
        deleteCanvas: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await deleteCanvas(id);
            set((state) => ({
              canvases: state.canvases.filter((c) => c.id !== id),
              selectedCanvasId: state.selectedCanvasId === id ? null : state.selectedCanvasId,
              currentCanvas: state.currentCanvas?.canvas.id === id ? null : state.currentCanvas,
            }));
          } catch (err) {
            console.error("Failed to delete canvas:", err);
            set({ error: "Failed to delete canvas" });
            throw err;
          } finally {
            set({ loading: false });
          }
        },
        updateTitle: async (id: string, title: string) => {
          set({ loading: true, error: null });
          try {
            const updated = await updateCanvasTitle(id, title);
            set((state) => ({
              canvases: state.canvases.map((c) => (c.id === id ? updated : c)),
              currentCanvas:
                state.currentCanvas?.canvas.id === id
                  ? { ...state.currentCanvas, canvas: updated }
                  : state.currentCanvas,
            }));
          } catch (err) {
            console.error("Failed to update canvas title:", err);
            set({ error: "Failed to update canvas title" });
            throw err;
          } finally {
            set({ loading: false });
          }
        },
        resetCurrentCanvas: () => set({ currentCanvas: null }),
      }),
      {
        name: "inferno/canvas-store",
        partialize: (state) => ({
          canvases: state.canvases,
          selectedCanvasId: state.selectedCanvasId,
        }),
      }
    )
  )
);
