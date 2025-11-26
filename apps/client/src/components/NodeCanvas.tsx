import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  // Node,
  // Edge,
  // NodeChange,
  // EdgeChange,
  // Connection,
} from "reactflow";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "reactflow";
import "reactflow/dist/style.css";
import ChatNode, { type ChatNodeData } from "./ChatNode";
import { toast } from "sonner";
import { SidebarTrigger } from "./ui/sidebar";
import { createCanvas, createNode } from "@/lib/canvas-api";
import { createConversation } from "@/lib/conversations-api";
import { useConversationHistoryStore } from "@/stores/conversation-history";
import { useConversationDetailStore } from "@/stores/conversation-detail";

// The options to hide the attribution watermark.
const proOptions = {
  hideAttribution: true,
};

const nodeTypes = {
  chat: ChatNode,
};

let nodeId = 1;

const NodeCanvas = () => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isPaneInteractive, setIsPaneInteractive] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { selectedConversationId } = useConversationHistoryStore();
  const { detail, loading: detailLoading } = useConversationDetailStore();

  // server ids
  const [canvasId, setCanvasId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Calculate center position based on window dimensions
  const getCenterPosition = () => {
    const centerX = (windowDimensions.width - 280) / 2 - 140; // 100px offset to the left
    const centerY = (windowDimensions.height - 400) / 2 - 10; // 50px offset to the top
    return { x: Math.max(0, centerX), y: Math.max(0, centerY) };
  };

  const setIsPanelInteractiveStable = useCallback((interactive: boolean) => {
    setIsPaneInteractive(interactive);
  }, []);

  const initialNodes: Node<{ label: string; setIsPaneInteractive: (interactive: boolean) => void }>[] = [
    // {
    //   id: "0",
    //   type: "chat",
    //   position: getCenterPosition(),
    //   data: {
    //     label: "Chat Node",
    //     setIsPaneInteractive: setIsPanelInteractiveStable,
    //   },
    // },
  ];
  const [nodes, setNodes] = useState<Node<{ label: string }>[]>(initialNodes);

  // Add ref to track if initialization has started
  const initStarted = useRef(false);

  const hydrateNodes = useCallback(
    (detailNodes: typeof detail.nodes) =>
      detailNodes.map((node, idx) => ({
        id: node.id,
        type: "chat",
        position: {
          // x: node?.position?.x ?? getCenterPosition().x + idx * 40,
          // y: node?.position?.y ?? getCenterPosition().y + idx * 40,
          x: Math.max(0, (windowDimensions.width - 280) / 2 - 140) + idx * 400,
          y: Math.max(0, (windowDimensions.height - 400) / 2 - 10) + idx * 40,
        },
        data: {
          label: node.label,
          conversationId: detail?.conversation.id,
          dbNodeId: node.id,
          provider: node.provider,
          model: node.model,
          setIsPaneInteractive: setIsPanelInteractiveStable,
          initialMessages: node.messages,
        },
      })),
    [detail, setIsPanelInteractiveStable]
  );

  // create canvas + conversation on mount
  // useEffect(() => {
  //   // Guard: Only run once
  //   if (initStarted.current || canvasId !== null) {
  //     return;
  //   }

  //   initStarted.current = true;
  //   // const cancelled = false;

  //   async function createConversationInDb() {
  //     try {
  //       const ownCanvas = await createCanvas({});
  //       console.log("oCanvas--", ownCanvas);
  //       // if (cancelled) return;
  //       setCanvasId(ownCanvas.id);

  //       const convo = await createConversation({ canvasId: ownCanvas.id, title: "Untitled" });
  //       console.log("convo--", convo);
  //       // if (cancelled) return;
  //       setConversationId(convo.id);

  //       const nodeData = await createNode(ownCanvas.id, {
  //         label: "Chat Node",
  //         provider: "groq",
  //         model: "groq/compound",
  //       });
  //       console.log("Initial node created--", nodeData);

  //       // Inject conversationId into existing nodes data
  //       setNodes((prev) =>
  //         prev.map((n) => ({
  //           ...n,
  //           data: { ...(n.data as any), conversationId: convo.id, dbNodeId: nodeData.id },
  //         }))
  //       );
  //     } catch (err) {
  //       console.log("err", err);
  //     }
  //   }
  //   createConversationInDb();
  //   return () => {
  //     console.log("Cleanup--NodeCanvas-useEffect -00 ");
  //     // cancelled = true;
  //   };
  // }, []);

  // Hydrate canvas whenever a conversation is selected
  useEffect(() => {
    if (!selectedConversationId || !detail || detail.conversation.id !== selectedConversationId) {
      console.log("detail---missing--", detail);
      return;
    }
    setConversationId(detail.conversation.id);
    setCanvasId(detail.canvas?.id ?? null);
    setEdges([]);
    nodeId = detail.nodes?.length + 1 || 1;
    // const hydra = hydrateNodes(detail.nodes);
    // console.log("hydra--", hydra);

    setNodes(hydrateNodes(detail.nodes));
  }, [selectedConversationId, detail, hydrateNodes]);

  // Update window dimensions and recalculate node positions
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update initial node position when window dimensions change
  // useEffect(() => {
  //   if (windowDimensions.width > 0 && windowDimensions.height > 0) {
  //     setNodes((prevNodes) =>
  //       prevNodes.map((node) => (node.id === "0" ? { ...node, position: getCenterPosition() } : node))
  //     );
  //   }
  // }, [windowDimensions]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), []);

  const addChatNode = async () => {
    if (nodes.length > 5) {
      toast("Cannot create more nodes", {
        description: "Max node limit reached!!",
        action: {
          label: "OK!",
          onClick: () => {},
        },
      });
      return;
    }

    // if (!canvasId || !conversationId) {
    //   toast("Please wait while conversation initializes");
    //   return;
    // }

    try {
      // Create visual node only - no DB operations
      const label = `Chat Node ${nodeId}`;
      // Provider/model currently mirrored from chatNode usage
      const newNode = {
        id: `${nodeId}`,
        type: "chat",
        position: {
          // Spawns nodes over a large area
          x: Math.random() * 800,
          y: Math.random() * 800,
        },
        data: {
          label,
          setIsPaneInteractive: setIsPanelInteractiveStable,
          ...(conversationId && { conversationId }),
          // dbNodeId: nodeData.id,
          // No conversationId or dbNodeId yet - will be created on first message
          onInitializeNode: initializeNodeInDb, // Pass callback to create DB resources
        },
      };
      setNodes((nds) => [...nds, newNode]);
      nodeId++;
    } catch (e) {
      console.log("err", e);
      toast("Failded to create node");
    }
    // const newNode = {
    //     id: `${nodeId}`,
    //     type: 'chat',
    //     position: {
    //         // Spawns nodes over a larger area
    //         x: Math.random() * 800,
    //         y: Math.random() * 800,
    //     },
    //     data: {
    //         label: `Chat Node ${nodeId}`,
    //         setIsPaneInteractive: setIsPaneInteractive
    //     },
    // };
    // setNodes((nds) => [...nds, newNode]);
    // nodeId++; // Increment after creating the node
  };

  // useEffect(() => {
  //     console.log("i-->", isPaneInteractive);
  // }, [isPaneInteractive])

  const initializeNodeInDb = useCallback(
    async (nodeId: string, label: string) => {
      try {
        let currentCanvasId = canvasId;

        if (!currentCanvasId) {
          const ownCanvas = await createCanvas({});
          currentCanvasId = ownCanvas.id;
          console.log("oCanvas--", ownCanvas);
          setCanvasId(ownCanvas.id);
        }

        let currentConversationId = conversationId;
        if (!currentConversationId) {
          const convo = await createConversation({
            canvasId: currentCanvasId,
            title: "Untitled",
          });
          currentConversationId = convo.id;
          console.log("convo--", convo);
          setConversationId(convo.id);
        }

        // Create node in DB
        const nodeData = await createNode(currentCanvasId, {
          label,
          provider: "groq",
          model: "groq/compound",
        });

        // Update the node's data with DB IDs
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...(n.data as ChatNodeData),
                    conversationId: currentConversationId,
                    dbNodeId: nodeData.id,
                    // Remove the callback after initialization
                    onInitializeNode: undefined,
                  },
                }
              : n
          )
        );

        return {
          conversationId: currentConversationId,
          dbNodeId: nodeData.id,
        };
      } catch (error) {
        console.error("Failed to initialize node in DB:", error);
      }
    },
    [canvasId, conversationId]
  );

  return (
    // --- FIX IS HERE ---
    // The height is now 200% of the viewport height, creating a large scrollable area.
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <SidebarTrigger />
      <button
        onClick={addChatNode}
        className="bg-[rgb(99 99 99 / 5%)] hover:bg-zinc-700/30 rounded-lg border border-zinc-800 backdrop-blur-[1px]"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        // 3. CONTROL REACT FLOW'S PROPS with our state.
        zoomOnScroll={isPaneInteractive}
        panOnScroll={isPaneInteractive}
        preventScrolling={isPaneInteractive} // Important for some trackpads
      >
        <Background />
        <Controls className="absolute top-[50%] left-1" />
      </ReactFlow>
    </div>
  );
};

export default NodeCanvas;
