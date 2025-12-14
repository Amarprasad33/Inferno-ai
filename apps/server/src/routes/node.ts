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

export const nodes = new Hono<AppVars>();

// Create a conversation
nodes.post("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const { label, canvasId, provider, model } = await c.req.json().catch(() => ({}) as any);
  console.log("label", label);
  console.log("canvasId", canvasId);

  // Optional: verify canvas belongs to user if provided
  if (canvasId) {
    const canvas = await prisma.canvas.findFirst({
      where: { id: canvasId, ownerId: user.id },
    });
    if (!canvas) return c.json({ error: "invalid canvas" }, 400);
  }
  const conv = await prisma.node.create({
    data: {
      // userId: user.id,
      canvasId: canvasId ?? null,
      label: label?.slice(0, 200) || "Untitled",
      userId: user.id,
      provider: provider ?? "openai",
      model: model ?? "gpt-3.5-turbo",
    },
    select: {
      id: true,
      userId: true,
      label: true,
      canvasId: true,
      createdAt: true
    },
  });
  return c.json(conv, 201);
});

// List conversations (excluding soft-deleted)
nodes.get("/", requireAuth, async (c) => {
  const user = c.get("user")!;
  const nodes = await prisma.node.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      label: true,
      canvasId: true,
      createdAt: true,
    },
  });
  return c.json({ nodes });
});

// Get conversation with messages; optional ?nodeId=... to filter node-specific thread
nodes.get("/:id", requireAuth, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  // const nodeId = c.req.query("nodeId");

  const node = await prisma.node.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      label: true,
      canvasId: true,
      createdAt: true,
    },
  });
  if (!node) return c.body(null, 404);

  const canvas = node.canvasId
    ? await prisma.canvas.findFirst({
      where: { id: node.canvasId, ownerId: user.id },
      select: { id: true, title: true, createdAt: true },
    })
    : null;
  if (node.canvasId && !canvas) return c.body(null, 404);

  const messages = await prisma.message.findMany({
    where: {
      nodeId: id,
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      nodeId: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  // fetching nodes to send node-wise-messages
  const nodes = node.canvasId
    ? await prisma.node.findMany({
      where: { canvasId: node.canvasId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        label: true,
        provider: true,
        model: true,
        createdAt: true,
      },
    })
    : [];

  const nodesWithMessages = nodes.map((node) => ({
    ...node,
    messages: messages.filter((m) => m.nodeId === node.id),
  }));

  const outMessages = messages.map((m) => {
    return {
      id: m.id,
      nodeId: m.nodeId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    };
  });

  return c.json({
    node,
    canvas,
    nodes: nodesWithMessages,
    messages: outMessages,
  });
});

// Append a message to a conversation (node-specific)
nodes.post("/:id/messages", requireAuth, async (c) => {
  const user = c.get("user")!;
  const nodeId = c.req.param("id");
  const body = (await c.req.json().catch(() => null)) as {
    role?: "user" | "assistant" | "system";
    content?: string;
  } | null;
  if (!body?.role || typeof body.content !== "string") {
    return c.json({ error: "role, content required" }, 400);
  }

  // Verify node ownership
  // var node = await prisma.node.findFirst({
  //   where: { id, userId: user.id },
  // });
  // if (!node) return c.body(null, 404);

  // Verify node belongs to user's canvas (if conversation is scoped to a canvas) or belongs to the user via canvas ownership
  // const node = await prisma.node.findFirst({
  //   where: node.canvasId
  //     ? {
  //       id: body.nodeId,
  //       canvasId: node.canvasId,
  //       canvas: { ownerId: user.id },
  //     }
  //     : { id: body.nodeId, canvas: { ownerId: user.id } },
  //   select: { id: true },
  // });
  const node = await prisma.node.findFirst({
    where: { id: nodeId, userId: user.id },
    select: { id: true },
  });
  if (!node) return c.json({ error: "invalid node" }, 400);

  const msg = await prisma.message.create({
    data: {
      nodeId: node.id,
      role: body.role,
      content: body.content,
    },
    select: { id: true, nodeId: true, role: true, createdAt: true },
  });

  // Touch node.updatedAt
  await prisma.node.update({
    where: { id: node.id },
    data: { updatedAt: new Date() },
  });

  return c.json(
    {
      id: msg.id,
      nodeId: msg.nodeId,
      role: msg.role,
      content: body.content,
      createdAt: msg.createdAt,
    },
    201
  );
});

// // Update node label
// nodes.patch("/:id", requireAuth, async (c) => {
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

// Delete conversation (soft delete)
nodes.delete("/:id", requireAuth, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  const node = await prisma.node.findFirst({
    where: { id, userId: user.id },
  });
  if (!node) return c.body(null, 404);
  await prisma.node.delete({
    where: { id },
  });
  return c.body(null, 204);
});

// Optional: delete a single message
nodes.delete("/:id/messages/:messageId", requireAuth, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  const messageId = c.req.param("messageId");

  const node = await prisma.node.findFirst({
    where: { id, userId: user.id },
  });
  if (!node) return c.body(null, 404);

  // Ensure message is part of this conversation and belongs to user's canvas
  const msg = await prisma.message.findFirst({
    where: {
      id: messageId,
      nodeId: id,
    },
    select: { id: true },
  });
  if (!msg) return c.body(null, 404);

  await prisma.message.delete({ where: { id: messageId } });
  return c.body(null, 204);
});
