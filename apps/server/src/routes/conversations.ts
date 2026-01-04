import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { prisma } from "../lib/prisma";
import { auth } from "../auth";

type AppVars = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const requireAuth: MiddlewareHandler<AppVars> = async (c, next) => {
  const user = c.get("user");
  if (!user) return c.body(null, 401);
  return next();
};

export const conversations = new Hono<AppVars>();

// Create a conversation
conversations.post("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const { title, canvasId } = await c.req.json().catch(() => ({}) as any);
  console.log("title", title);
  console.log("canvasId", canvasId);

  // Optional: verify canvas belongs to user if provided
  // if (canvasId) {
  //   const canvas = await prisma.canvas.findFirst({
  //     where: { id: canvasId, ownerId: user.id },
  //   });
  //   if (!canvas) return c.json({ error: "invalid canvas" }, 400);
  // }
  // const conv = await prisma.conversation.create({
  //   data: {
  //     userId: user.id,
  //     canvasId: canvasId ?? null,
  //     title: title?.slice(0, 200) || "Untitled",
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     canvasId: true,
  //     createdAt: true,
  //     updatedAt: true,
  //   },
  // });
  // return c.json(conv, 201);
});

// // List conversations (excluding soft-deleted)
// conversations.get("/", requireAuth, async (c) => {
//   const user = c.get("user")!;
//   const items = await prisma.conversation.findMany({
//     where: { userId: user.id, deletedAt: null },
//     orderBy: { updatedAt: "desc" },
//     select: {
//       id: true,
//       title: true,
//       canvasId: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
//   return c.json({ conversations: items });
// });

// // Get conversation with messages; optional ?nodeId=... to filter node-specific thread
// conversations.get("/:id", requireAuth, async (c) => {
//   const user = c.get("user")!;
//   const id = c.req.param("id");
//   // const nodeId = c.req.query("nodeId");

//   const conv = await prisma.conversation.findFirst({
//     where: { id, userId: user.id, deletedAt: null },
//     select: {
//       id: true,
//       title: true,
//       canvasId: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });
//   if (!conv) return c.body(null, 404);

//   const canvas = conv.canvasId
//     ? await prisma.canvas.findFirst({
//         where: { id: conv.canvasId, ownerId: user.id },
//         select: { id: true, title: true, createdAt: true },
//       })
//     : null;
//   if (conv.canvasId && !canvas) return c.body(null, 404);

//   const messages = await prisma.message.findMany({
//     where: {
//       conversationId: id,
//       // ...(nodeId ? { nodeId } : {}),
//     },
//     orderBy: { createdAt: "asc" },
//     select: {
//       id: true,
//       nodeId: true,
//       role: true,
//       content: true,
//       createdAt: true,
//     },
//   });

//   // fetching nodes to send node-wise-messages
//   const nodes = conv.canvasId
//     ? await prisma.node.findMany({
//         where: { canvasId: conv.canvasId },
//         orderBy: { createdAt: "asc" },
//         select: {
//           id: true,
//           label: true,
//           provider: true,
//           model: true,
//           createdAt: true,
//         },
//       })
//     : [];

//   const nodesWithMessages = nodes.map((node) => ({
//     ...node,
//     messages: messages.filter((m) => m.nodeId === node.id),
//   }));

//   const outMessages = messages.map((m) => {
//     return {
//       id: m.id,
//       nodeId: m.nodeId,
//       role: m.role,
//       content: m.content,
//       createdAt: m.createdAt,
//     };
//   });

//   return c.json({
//     conversation: conv,
//     canvas,
//     nodes: nodesWithMessages,
//     messages: outMessages,
//   });
// });

// // Append a message to a conversation (node-specific)
// conversations.post("/:id/messages", requireAuth, async (c) => {
//   const user = c.get("user")!;
//   const id = c.req.param("id");
//   const body = (await c.req.json().catch(() => null)) as {
//     nodeId?: string;
//     role?: "user" | "assistant" | "system";
//     content?: string;
//   } | null;
//   if (!body?.nodeId || !body?.role || typeof body.content !== "string") {
//     return c.json({ error: "nodeId, role, content required" }, 400);
//   }

//   // Verify conversation ownership
//   const conv = await prisma.conversation.findFirst({
//     where: { id, userId: user.id, deletedAt: null },
//   });
//   if (!conv) return c.body(null, 404);

//   // Verify node belongs to user's canvas (if conversation is scoped to a canvas) or belongs to the user via canvas ownership
//   const node = await prisma.node.findFirst({
//     where: conv.canvasId
//       ? {
//           id: body.nodeId,
//           canvasId: conv.canvasId,
//           canvas: { ownerId: user.id },
//         }
//       : { id: body.nodeId, canvas: { ownerId: user.id } },
//     select: { id: true },
//   });
//   if (!node) return c.json({ error: "invalid node" }, 400);

//   const msg = await prisma.message.create({
//     data: {
//       conversationId: id,
//       nodeId: node.id,
//       role: body.role,
//       content: body.content,
//     },
//     select: { id: true, nodeId: true, role: true, createdAt: true },
//   });

//   // Touch conversation.updatedAt
//   await prisma.conversation.update({
//     where: { id },
//     data: { updatedAt: new Date() },
//   });

//   return c.json(
//     {
//       id: msg.id,
//       nodeId: msg.nodeId,
//       role: msg.role,
//       content: body.content,
//       createdAt: msg.createdAt,
//     },
//     201
//   );
// });

// // Update conversation title
// conversations.patch("/:id", requireAuth, async (c) => {
//   const user = c.get("user");
//   const id = c.req.param("id");
//   const body = (await c.req.json().catch(() => null)) as {
//     title?: string;
//   } | null;
//   const title = body?.title?.trim();
//   if (!title) return c.json({ error: "title required" }, 400);

//   const conv = await prisma.conversation.findFirst({
//     where: { id: id, userId: user?.id, deletedAt: null },
//   });
//   if (!conv) return c.body(null, 404);

//   const updated = await prisma.conversation.update({
//     where: { id },
//     data: { title: title.slice(0, 200), updatedAt: new Date() },
//     select: {
//       id: true,
//       title: true,
//       canvasId: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });

//   return c.json(updated);
// });

// // Delete conversation (soft delete)
// conversations.delete("/:id", requireAuth, async (c) => {
//   const user = c.get("user")!;
//   const id = c.req.param("id");
//   const conv = await prisma.conversation.findFirst({
//     where: { id, userId: user.id, deletedAt: null },
//   });
//   if (!conv) return c.body(null, 404);
//   await prisma.conversation.update({
//     where: { id },
//     data: { deletedAt: new Date() },
//   });
//   return c.body(null, 204);
// });

// // Optional: delete a single message
// conversations.delete("/:id/messages/:messageId", requireAuth, async (c) => {
//   const user = c.get("user")!;
//   const id = c.req.param("id");
//   const messageId = c.req.param("messageId");

//   const conv = await prisma.conversation.findFirst({
//     where: { id, userId: user.id },
//   });
//   if (!conv) return c.body(null, 404);

//   // Ensure message is part of this conversation and belongs to user's canvas
//   const msg = await prisma.message.findFirst({
//     where: {
//       id: messageId,
//       conversationId: id,
//       node: { canvas: { ownerId: user.id } },
//     },
//     select: { id: true },
//   });
//   if (!msg) return c.body(null, 404);

//   await prisma.message.delete({ where: { id: messageId } });
//   return c.body(null, 204);
// });
