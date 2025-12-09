import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  ApiError,
  deleteConversation,
  listConversations,
  updateConversationTitle,
  type Conversation,
} from "@/lib/conversations-api";
import { toast } from "sonner";

type ConversationHistoryState = {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  setConversations: (items: Conversation[]) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  refreshConversations: () => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
};

export const useConversationHistoryStore = create<ConversationHistoryState>()(
  devtools(
    persist(
      (set, get) => ({
        conversations: [],
        loading: false,
        error: null,
        selectedConversationId: null,
        setSelectedConversationId: (id) => set({ selectedConversationId: id }),
        setConversations: (items) => set({ conversations: items }),
        setLoading: (value) => set({ loading: value }),
        setError: (message) => set({ error: message }),
        refreshConversations: async () => {
          const { setLoading, setConversations, setError } = get();
          setLoading(true);
          try {
            console.log("refreshing-conversations------🔵🔵");
            const res = await listConversations();
            console.log("res-conversations------", res);
            setConversations(res.conversations);
            setError(null);
          } catch (err) {

            console.log("error", err);
            // const msg = err instanceof Error ? err.message : "Failed to load conversations";
            let msg = "Failed to load conversations";
            if (err instanceof ApiError && err.status === 401) {
              msg = "Please sign in to load your chat history.";
              toast("Sign in required", {
                description: msg,
                action: { label: "Sign in", onClick: () => (window.location.href = "/signin") },
              })
            } else {
              msg = err instanceof Error ? err.message : msg;
              toast("Unable to refresh conversations", { description: msg })
            }
            setError(msg);
          } finally {
            setLoading(false);
          }
        },
        updateTitle: async (id: string, title: string) => {
          set({ loading: true });
          try {
            const updated = await updateConversationTitle(id, title);
            console.log("update-res", updated);
            set((state) => ({
              conversations: state.conversations.map((c) => (c.id === id ? updated : c)),
              loading: false,
            }));
          } catch (err: any) {
            set({ error: err.message ?? "Failed to rename", loading: false });
            throw err;
          }
        },
        removeConversation: async (id: string) => {
          set({ loading: true });
          try {
            await deleteConversation(id);
            set((state) => ({
              conversations: state.conversations.filter((c) => c.id !== id),
              selectedConversationId: state.selectedConversationId === id ? null : state.selectedConversationId,
              loading: false,
            }));
          } catch (err: any) {
            set({ error: err.message ?? "Failed to delete", loading: false });
            throw err;
          }
        },
      }),
      {
        name: "inferno/conversation-history",
        partialize: (state) => ({
          conversations: state.conversations,
          selectedConversationId: state.selectedConversationId,
        }),
      }
    )
  )
);
