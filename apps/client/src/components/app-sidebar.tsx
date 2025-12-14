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
// import { useConversationHistoryStore } from "@/stores/conversation-history";
// import { useConversationDetailStore } from "@/stores/conversation-detail";
import { useCanvasStore } from "@/stores/canvas-store";
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
    canvases,
    loading,
    error,
    selectedCanvasId,
    setSelectedCanvasId,
    loadCanvases,
    loadCanvas,
    deleteCanvas,
    updateTitle,
  } = useCanvasStore();

  // State for rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [canvasToRename, setCanvasToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    // if (!loading && conversations.length === 0) {
    console.log("effect-sidebar");
    void loadCanvases();
    // }
  }, []);

  const handleSelect = async (id: string) => {
    // if (selectedConversationId === id) {
    //   console.log("sel--", selectedConversationId, "---", id);
    //   return;
    // }
    setSelectedCanvasId(id);
    try {
      console.log("detailLoading--", loading);
      await loadCanvas(id);
    } catch (err) {
      console.log("error--", err);
    }
    // const convoDetail = await getConversationDetail(id);
    // console.log("conv-Details-----0--", convoDetail);
    // if (isMobile) setOpenMobile(false);
    // else setOpen(false);
  };

  const refreshConvos = () => {
    loadCanvases();
  };

  const handleRenameClick = (canvas: { id: string; title: string }) => {
    setCanvasToRename(canvas);
    setNewTitle(canvas.title);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!canvasToRename || !newTitle || newTitle === canvasToRename.title) {
      setRenameDialogOpen(false);
      return;
    }
    try {
      await updateTitle(canvasToRename.id, newTitle);
      setRenameDialogOpen(false);
      setCanvasToRename(null);
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
            {!loading && canvases.length === 0 && <div>No canvases yet.</div>}
            {error && <div className="text-red-400 text-xs px-2 py-2">{error}</div>}
            {canvases.map((canvas) => (
              <SidebarMenuItem key={canvas.id}>
                <SidebarMenuButton
                  isActive={canvas.id === selectedCanvasId}
                  onClick={() => handleSelect(canvas.id)}
                  className="justify-between gap-2"
                >
                  <span className="flex-1 truncate">{canvas.title}</span>
                  <span className="text-[11px] text-zinc-500">{new Date(canvas.updatedAt).toLocaleString()}</span>
                </SidebarMenuButton>
                <div className="flex gap-2 px-2 py-1">
                  <Button size="sm" variant="outline" onClick={async () => handleRenameClick(canvas)}>
                    Rename
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (!confirm("Delete this canvas?")) return;
                      try {
                        await deleteCanvas(canvas.id);
                        // clearIfDeleted(conversation.id);
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
            <DialogTitle>Rename Canvas</DialogTitle>
            <DialogDescription>Enter a new name for this canvas.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Canvas title"
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
                setCanvasToRename(null);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit} disabled={!newTitle || newTitle === canvasToRename?.title}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
