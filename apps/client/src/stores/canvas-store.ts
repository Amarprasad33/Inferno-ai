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
import type { Node } from "@/lib/nodes-api";
import { ERROR_CODE, standardizeApiError, type ErrorResponseType } from "@/lib/error";
// import { toast } from "sonner";

type CanvasState = {
  canvases: Canvas[];
  currentCanvas: CanvasDetail | null;
  loading: boolean;
  error: string | null;
  selectedCanvasId: string | null;
  setSelectedCanvasId: (id: string | null) => void;
  loadCanvases: () => Promise<void>;
  loadCanvas: (id: string) => Promise<{ status: boolean; message?: string }>;
  createCanvas: (title?: string) => Promise<Canvas>;
  deleteCanvas: (id: string) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
  resetCurrentCanvas: () => void;

  // Nodes independent of Reactflow's insides
  nodes: Node[];
  nodesById: Map<string, Node>;
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  resetNodes: () => void;
};

export const useCanvasStore = create<CanvasState>()(
  devtools(
    persist(
      (set) => {
        const handleError = (err: unknown, action: string): ErrorResponseType => {
          const apiErr = standardizeApiError(err);
          if (apiErr.code === ERROR_CODE.UNAUTHORIZED) {
            set({ error: `Please sign in to ${action}.` });
          } else {
            set({ error: apiErr.message });
          }

          return apiErr;
        };

        return {
          canvases: [],
          currentCanvas: null,
          loading: false,
          error: null,
          selectedCanvasId: null,

          nodes: [],
          nodesById: new Map(),

          setSelectedCanvasId: (id) => set({ selectedCanvasId: id }),

          loadCanvases: async () => {
            set({ loading: true, error: null });
            try {
              const res = await listCanvases();
              set({ canvases: res.canvases });
            } catch (err) {
              handleError(err, "load your canvases");
            } finally {
              set({ loading: false });
            }
          },
          loadCanvas: async (id: string) => {
            set({ loading: true, error: null });
            try {
              const detail = await getCanvas(id);
              const clonedDetail = {
                ...detail,
                canvas: { ...detail.canvas },
                nodes: detail.nodes.map((n) => ({
                  ...n,
                  messages: n.messages ? n.messages.map((m) => ({ ...m })) : [],
                })),
              };
              set({ currentCanvas: clonedDetail });
              // set({ nodes: detail.nodes });
              set({
                nodes: detail.nodes.map((n) => ({
                  ...n,
                  messages: n.messages ? n.messages.map((m) => ({ ...m })) : [],
                })),
              });
              return { status: true, message: "Chat successfully loaded" };
            } catch (err) {
              const errObj = handleError(err, "load this canvas");
              set({ error: "Failed to load canvas" });
              return errObj;
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
              handleError(err, "create a canvas");
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
              handleError(err, "delete this canvas");
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
              handleError(err, "update this canvas");
              throw err;
            } finally {
              set({ loading: false });
            }
          },
          resetCurrentCanvas: () => set({ currentCanvas: null }),

          // Nodes related methods
          setNodes: (nodes: Node[]) => {
            const nodesMap = new Map<string, Node>();
            nodes.forEach((node) => {
              nodesMap.set(node.id, node);
            });
            set({ nodes, nodesById: nodesMap });
          },
          addNode: (node: Node) => {
            set((state) => {
              const newNodes = [...state.nodes, node];
              const newMap = new Map(state.nodesById);
              newMap.set(node.id, node);
              return { nodes: newNodes, nodesById: newMap };
            });
          },
          removeNode: (nodeId: string) => {
            set((state) => {
              const newNodes = state.nodes.filter((n) => n.id !== nodeId);
              const newMap = new Map(state.nodesById);
              newMap.delete(nodeId);
              return { nodes: newNodes, nodesById: newMap };
            });
          },
          resetNodes: () => set({ nodes: [], nodesById: new Map() }),
        };
      },
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
