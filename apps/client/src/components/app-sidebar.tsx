import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarContent,
  SidebarGroupLabel,
  SidebarGroupContent,
  // SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
// import { getConversationDetail } from "@/lib/conversations-api";
import { useConversationHistoryStore } from "@/stores/conversation-history";
import { useConversationDetailStore } from "@/stores/conversation-detail";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AppSidebar() {
  const {
    conversations,
    loading,
    error,
    selectedConversationId,
    setSelectedConversationId,
    refreshConversations,
    updateTitle,
    removeConversation,
  } = useConversationHistoryStore();
  const {
    loadDetail,
    loading: detailLoading,
    error: detailError,
    updateConversationTitleLocally,
    clearIfDeleted,
  } = useConversationDetailStore();

  // State for rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    // if (!loading && conversations.length === 0) {
    console.log("effect-sidebar");
    void refreshConversations();
    // }
  }, []);

  const handleSelect = async (id: string) => {
    // if (selectedConversationId === id) {
    //   console.log("sel--", selectedConversationId, "---", id);
    //   return;
    // }
    setSelectedConversationId(id);
    try {
      console.log("detailLoading--", detailLoading);
      await loadDetail(id);
    } catch (err) {
      console.log("error--", err);
      console.log("detailErr", detailError);
    }
    // const convoDetail = await getConversationDetail(id);
    // console.log("conv-Details-----0--", convoDetail);
    // if (isMobile) setOpenMobile(false);
    // else setOpen(false);
  };

  const refreshConvos = () => {
    refreshConversations();
  };

  const handleRenameClick = (conversation: { id: string; title: string }) => {
    setConversationToRename(conversation);
    setNewTitle(conversation.title);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!conversationToRename || !newTitle || newTitle === conversationToRename.title) {
      setRenameDialogOpen(false);
      return;
    }
    try {
      await updateTitle(conversationToRename.id, newTitle);
      updateConversationTitleLocally(conversationToRename.id, newTitle);
      setRenameDialogOpen(false);
      setConversationToRename(null);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <Button onClick={refreshConvos}>Refresh</Button>
          <SidebarGroupContent>
            {/* <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Flashlight Accodtion</SidebarMenuButton>
                <SidebarMenuButton>Flashlight Tabs</SidebarMenuButton>
                <SidebarMenuButton>Flashlight Checkbox</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu> */}
            {loading && <SidebarMenuSkeleton />}
            {!loading && conversations.length === 0 && <div>No conversations yet.</div>}
            {error && <div className="text-red-400 text-xs px-2 py-2">{error}</div>}
            {conversations.map((conversation) => (
              <SidebarMenuItem key={conversation.id}>
                <SidebarMenuButton
                  isActive={conversation.id === selectedConversationId}
                  onClick={() => handleSelect(conversation.id)}
                  className="justify-between gap-2"
                >
                  <span className="flex-1 truncate">{conversation.title}</span>
                  <span className="text-[11px] text-zinc-500">{new Date(conversation.updatedAt).toLocaleString()}</span>
                </SidebarMenuButton>
                <div className="flex gap-2 px-2 py-1">
                  <Button size="sm" variant="outline" onClick={async () => handleRenameClick(conversation)}>
                    Rename
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (!confirm("Delete this conversation?")) return;
                      try {
                        await removeConversation(conversation.id);
                        clearIfDeleted(conversation.id);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>Enter a new name for this conversation.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Conversation title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameSubmit();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenameDialogOpen(false);
                setConversationToRename(null);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit} disabled={!newTitle || newTitle === conversationToRename?.title}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
