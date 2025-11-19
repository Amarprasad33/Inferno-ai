import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { listConversations, type Conversation } from "@/lib/conversations-api";

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
            const res = await listConversations();
            console.log("res-conversations------", res);
            setConversations(res.conversations);
            setError(null);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load conversations";
            setError(msg);
          } finally {
            setLoading(false);
          }
        },
      }),
      {
        name: 'inferno/conversation-history',
        partialize: (state) => ({
          conversations: state.conversations,
          selectedConversationId: state.selectedConversationId,
        })
      }
    )
  )
);