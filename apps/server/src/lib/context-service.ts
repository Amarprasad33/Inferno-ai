import { prisma } from "./prisma";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Aggregates messages from multiple nodes, maintaining chronological order
 * @param nodeIds Array of node IDs to fetch messages from
 * @param userId User ID to ensure ownership validation
 * @returns Array of ChatMessages ordered by creation time across all nodes
 */
export async function aggregateMessages(
  nodeIds: string[],
  userId: string
): Promise<ChatMessage[]> {
  if (nodeIds.length === 0) {
    return [];
  }

  // Validate that all nodes belong to the user
  const nodes = await prisma.node.findMany({
    where: {
      id: { in: nodeIds },
      userId: userId,
    },
    select: { id: true },
  });

  const validNodeIds = nodes.map((n) => n.id);
  if (validNodeIds.length === 0) {
    return [];
  }

  // Fetch all messages from the valid nodes in a single query
  const messages = await prisma.message.findMany({
    where: {
      nodeId: { in: validNodeIds },
    },
    select: {
      role: true,
      content: true,
      createdAt: true,
      nodeId: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Convert to ChatMessage format
  return messages.map((msg) => ({
    role: msg.role as "system" | "user" | "assistant",
    content: msg.content,
  }));
}

/**
 * Aggregates messages from a context chain and appends a user message
 * @param contextChainIds Ordered array of node IDs (upstream nodes first, current node last)
 * @param userMessage The new user message to append
 * @param userId User ID for ownership validation
 * @returns Array of ChatMessages with user message appended
 */
export async function aggregateContextWithUserMessage(
  contextChainIds: string[],
  userMessage: string,
  userId: string
): Promise<ChatMessage[]> {
  // Fetch messages from all nodes in the chain
  const contextMessages = await aggregateMessages(contextChainIds, userId);

  const lastMessage = contextMessages[contextMessages.length - 1];
  const isDuplicate =
    lastMessage?.role === "user" && lastMessage?.content === userMessage;
  // Append the user message
  return isDuplicate
    ? contextMessages
    : [
        ...contextMessages,
        {
          role: "user" as const,
          content: userMessage,
        },
      ];
}
