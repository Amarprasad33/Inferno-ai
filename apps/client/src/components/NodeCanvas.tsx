import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  // Node,
  // Edge,
  // NodeChange,
  // EdgeChange,
  // Connection,
} from "reactflow";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "reactflow";
import "reactflow/dist/style.css";
import ChatNode, { type ChatNodeData, DEFAULT_WELCOME_MESSAGE } from "./ChatNode";
import { toast } from "sonner";
import { SidebarTrigger } from "./ui/sidebar";
import { createCanvas, createNode, type CanvasDetail } from "@/lib/canvas-api";
import { appendMessage } from "@/lib/nodes-api";
// import { createConversation } from "@/lib/conversations-api";
import { useCanvasStore } from "@/stores/canvas-store";
import CustomEdge from "./custom/CustomEdge";

// The options to hide the attribution watermark.
const proOptions = {
  hideAttribution: true,
};

const nodeTypes = {
  chat: ChatNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

let nodeId = 1;

const NodeCanvas = () => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isPaneInteractive, setIsPaneInteractive] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { selectedCanvasId, currentCanvas } = useCanvasStore();
  // const { selectedConversationId } = useConversationHistoryStore();
  // const { detail } = useConversationDetailStore();

  // server ids
  const [canvasId, setCanvasId] = useState<string | null>(null);
  // const [conversationId, setConversationId] = useState<string | null>(null);

  // Calculate center position based on window dimensions
  // const getCenterPosition = () => {
  //   const centerX = (windowDimensions.width - 280) / 2 - 140; // 100px offset to the left
  //   const centerY = (windowDimensions.height - 400) / 2 - 10; // 50px offset to the top
  //   return { x: Math.max(0, centerX), y: Math.max(0, centerY) };
  // };

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
  // const initStarted = useRef(false);

  const hydrateNodes = useCallback(
    (detailNodes: CanvasDetail["nodes"]) =>
      (detailNodes || []).map((node, idx) => ({
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
          // conversationId: detail?.conversation.id,
          dbNodeId: node.id,
          provider: node.provider,
          model: node.model,
          setIsPaneInteractive: setIsPanelInteractiveStable,
          // initialMessages: node.messages,
          initialMessages: node.messages || [],
        },
      })),
    // [detail, setIsPanelInteractiveStable]
    // [windowDimensions, setIsPanelInteractiveStable]
    [currentCanvas, setIsPanelInteractiveStable]
  );

  // Hydrate canvas whenever a canvas is selected
  useEffect(() => {
    if (!selectedCanvasId || !currentCanvas || currentCanvas.canvas.id !== selectedCanvasId) {
      console.log("detail---missing--", currentCanvas);
      return;
    }
    // setConversationId(detail.conversation.id);
    setCanvasId(currentCanvas.canvas?.id ?? null);
    setEdges([]);
    nodeId = currentCanvas.nodes?.length + 1 || 1;
    // const hydra = hydrateNodes(detail.nodes);
    console.log("hydra--", currentCanvas);

    setNodes(hydrateNodes(currentCanvas.nodes));

    return () => {
      setCanvasId(null);
    };
  }, [selectedCanvasId, currentCanvas, hydrateNodes]);

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

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    console.log("changes--", changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => {
    console.log("params", params, nodes);
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);

    console.log("sourceNode", sourceNode);
    console.log("targetNode", targetNode);

    setEdges((eds) => addEdge(params, eds));
  }, []);

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
      let position: { x: number; y: number };

      if (nodes.length === 0) {
        // First node at initial position
        position = { x: 100, y: 100 };
      } else {
        // Subsequent nodes positioned relative to the last node
        const lastNode = nodes[nodes.length - 1];
        position = {
          x: lastNode.position.x + 600,
          y: lastNode.position.y + 0,
        };
      }
      // Create visual node only - no DB operations
      const label = `Chat Node ${nodeId}`;
      // Provider/model currently mirrored from chatNode usage
      const newNode = {
        id: `${nodeId}`,
        type: "chat",
        position: position,
        // position: {
        //   // Spawns nodes over a large area
        //   x: 100,
        //   y: 100,
        // },
        data: {
          label,
          setIsPaneInteractive: setIsPanelInteractiveStable,
          // ...(conversationId && { conversationId }),
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

        // let currentConversationId = conversationId;
        // if (!currentConversationId) {
        //   const convo = await createConversation({
        //     canvasId: currentCanvasId,
        //     title: "Untitled",
        //   });
        //   currentConversationId = convo.id;
        //   console.log("convo--", convo);
        //   setConversationId(convo.id);
        // }

        // Create node in DB
        const nodeData = await createNode(currentCanvasId, {
          label,
          provider: "groq",
          model: "groq/compound",
        });

        // Persist default welcome message
        try {
          await appendMessage(nodeData.id, {
            role: "assistant",
            content: DEFAULT_WELCOME_MESSAGE,
          });
        } catch (err) {
          console.error("Failed to persist default message:", err);
        }

        // Update the node's data with DB IDs
        setNodes((prev) =>
          prev.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...(n.data as ChatNodeData),
                    dbNodeId: nodeData.id,
                    // conversationId: currentConversationId,
                    // Remove the callback after initialization
                    onInitializeNode: undefined,
                  },
                }
              : n
          )
        );

        return {
          dbNodeId: nodeData.id,
          // conversationId: currentConversationId,
        };
      } catch (error) {
        console.error("Failed to initialize node in DB:", error);
      }
    },
    [canvasId]
  );

  // const nodeClassName = (node: typeof ChatNode) => node.type;

  return (
    // --- FIX IS HERE ---
    // The height is now 200% of the viewport height, creating a large scrollable area.
    <div style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden" }}>
      <SidebarTrigger className="absolute top-20 left-5 p-1 rounded-md z-30 bg-zinc-900 hover:bg-zinc-700/30 border border-zinc-800" />
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
        color="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        defaultEdgeOptions={{ type: "custom" }}
        edgesFocusable={true}
        edgesUpdatable={true}
        // 3. CONTROL REACT FLOW'S PROPS with our state.
        zoomOnScroll={isPaneInteractive}
        panOnScroll={isPaneInteractive}
        preventScrolling={isPaneInteractive} // Important for some trackpads
        minZoom={0.2}
        translateExtent={[
          [-2000, -2000], // top-left bound
          [4000, 3000], // bottom-right bound
        ]}
        nodeExtent={[
          [-3800, -2000], // to keep the nodes inside the viewport bounds
          [6000, 3000],
        ]}
      >
        <Background />
        <Controls className="absolute top-[50%] left-1" />
        <MiniMap
          zoomable
          pannable
          color="dark"
          style={{ background: "#0b0b0c", border: "1px solid #1f1f1f" }}
          maskColor="rgba(20,20,20,0.6)"
          nodeColor={() => "#7dd3fc"}
          nodeStrokeColor={() => "#1f9cf0"}
        />
      </ReactFlow>
    </div>
  );
};

export default NodeCanvas;
