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
import { useConversationHistoryStore } from "@/stores/conversation-history";
import { useEffect } from "react";

export function AppSidebar() {
  const {
    conversations,
    loading,
    error,
    selectedConversationId,
    setSelectedConversationId,
    refreshConversations,
  } = useConversationHistoryStore();

  useEffect(() => {
    if (!loading && conversations.length === 0) {
      void refreshConversations();
    }
  }, [loading, conversations.length, refreshConversations]);

  const handleSelect = (id: string) => {
    setSelectedConversationId(id);
    // if (isMobile) setOpenMobile(false);
    // else setOpen(false);
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>

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
                >
                  <span className="flex-1 truncate">{conversation.title}</span>
                  <span className="text-[11px] text-zinc-500">
                    {new Date(conversation.updatedAt).toLocaleString()}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
