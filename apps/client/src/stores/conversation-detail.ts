import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getConversationDetail, type ConversationDetail } from "@/lib/conversations-api";

type ConversationDetailState = {
  detail: ConversationDetail | null;
  loading: boolean;
  error: string | null;
  loadDetail: (conversationId: string) => Promise<void>;
  reset: () => void;
};

export const useConversationDetailStore = create<ConversationDetailState>()(
  devtools((set) => ({
    detail: null,
    loading: false,
    error: null,
    loadDetail: async (conversationId: string) => {
      set({ loading: true, error: null });
      try {
        const detail = await getConversationDetail(conversationId);
        console.log("::detail---", detail);
        set({ detail });
      } catch (err) {
        console.log("err-", err);
        const message = err instanceof Error ? err.message : "Failed to load conversation detail";
        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },
    reset: () => set({ detail: null, loading: false, error: null }),
  }))
);
