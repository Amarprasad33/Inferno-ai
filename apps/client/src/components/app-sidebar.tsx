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
import React, { useEffect, useRef, useState } from "react";
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
import { SpinnerCustom } from "./ui/spinner";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { InfernoLogoSmall } from "@/icons";
import { useNavigate } from "@tanstack/react-router";
import { useSessionStore } from "@/stores/session-store";
import { standardizeApiError } from "@/lib/error";
import { toast } from "sonner";

export function AppSidebar() {
  const {
    canvases,
    loading,
    // error,
    // selectedCanvasId,
    setSelectedCanvasId,
    loadCanvases,
    loadCanvas,
    deleteCanvas,
    updateTitle,
    // createCanvas,
  } = useCanvasStore();

  // State for rename dialog
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [canvasToRename, setCanvasToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [sidebarLoading, setSidebarLoading] = useState(false);
  // Use ref to track if it's the first load
  const isInitialLoadRef = useRef(true);
  const navigate = useNavigate();
  const { user } = useSessionStore();

  useEffect(() => {
    // if (!loading && conversations.length === 0) {
    console.log("user--", user);
  }, [user]);

  useEffect(() => {
    // if (!loading && conversations.length === 0) {
    console.log("effect-sidebar");
    void loadCanvases();
    // }
  }, []);
  useEffect(() => {
    if (loading && isInitialLoadRef.current) {
      setSidebarLoading(true);
    } else {
      setSidebarLoading(false);
      if (!loading && isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    }
  }, [loading]);

  const handleSelect = async (id: string) => {
    // if (selectedConversationId === id) {
    //   console.log("sel--", selectedConversationId, "---", id);
    //   return;
    // }
    navigate({
      to: "/chat/$canvasId",
      params: { canvasId: id },
    });
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
      const error = standardizeApiError(err);
      if (!error.status) {
        toast("Something wrong happened!!", {
          description: "Cannot rename this history now! try after sometime.",
          action: {
            label: "Ok",
            onClick: () => { },
          },
        });
      }
      console.log("err-parsed---", error);
    }
  };

  return (
    <Sidebar>
      {sidebarLoading && (
        <div className="absolute inset-0 w-full h-full bg-zinc-900/80 z-50 backdrop-blur-xs flex items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <SpinnerCustom />
            <span className="text-zinc-200 text-sm font-normal">Loading...</span>
          </div>
        </div>
      )}

      <SidebarHeader>
        <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate({ to: "/" })}>
          <span className="bg-[#2A2A2A] p-[6px] rounded-[8px]">
            <InfernoLogoSmall className="w-5 h-5 text-white " />
          </span>
          <div className="font-space-grotesk font-semibold text-xl">Inferno</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={async () => {
              try {
                // const newCanvas = await createCanvas("New Conversation");
                // await loadCanvases();
                setSelectedCanvasId(null);
                await loadCanvas("");
                navigate({
                  to: "/chat",
                });
              } catch (err) {
                console.error("Failed to create new conversation:", err);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Chat
          </Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          {/* <Button onClick={refreshConvos}>Refresh</Button> */}
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
            {/* {error && <div className="text-red-400 text-xs px-2 py-2">{error}</div>} */}
            {canvases.map((canvas) => (
              <SidebarMenuItem key={canvas.id}>
                <SidebarMenuButton
                  // isActive={canvas.id === selectedCanvasId}
                  onClick={() => handleSelect(canvas.id)}
                  className="justify-between gap-2"
                >
                  <span className="flex-1 truncate">{canvas.title}</span>
                  {/* <span className="text-[11px] text-zinc-500">{new Date(canvas.updatedAt).toLocaleString()}</span> */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      {/* <Button variant="outline">Actions</Button> */}
                      <span
                        className="cursor-pointer rounded-sm px-[2px]"
                        aria-label="Open menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontalIcon size={18} />
                      </span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuLabel>History Actions</DropdownMenuLabel>

                      <DropdownMenuGroup>
                        <DropdownMenuItem disabled>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(canvas.updatedAt).toLocaleString()}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          onSelect={async (e) => {
                            e.stopPropagation();
                            handleRenameClick(canvas);
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => e.stopPropagation()}
                          className="text-red-400"
                          onSelect={async (e) => {
                            if (!confirm("Delete this canvas?")) return;
                            try {
                              e.stopPropagation();
                              await deleteCanvas(canvas.id);
                              setSelectedCanvasId(null);
                              await loadCanvas("");
                              navigate({
                                to: "/chat",
                              });
                              // clearIfDeleted(conversation.id);
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuButton>
                {/* <div className="flex gap-2 px-2 py-1">
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
                </div> */}
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-800 p-4">
        <div className="flex gap-3 items-center">
          {user && user?.image ? (
            <img
              src={user.image}
              alt={user.name ? `${user.name}'s avatar` : "User avatar"}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            user && (
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-500">
                {user?.name?.substring(0, 2)}
              </div>
            )
          )}
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium leading-[18px]">
              {user ? <React.Fragment>{user.name}</React.Fragment> : "User"}
            </div>
            <p className="text-sm leading-[18px]">Free</p>
          </div>
        </div>
      </SidebarFooter>

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
