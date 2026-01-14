import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
  useReactFlow,
} from "reactflow";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "reactflow";
import "reactflow/dist/style.css";
import ChatNode, { type ChatNodeData } from "./ChatNode";
import { toast } from "sonner";
import { SidebarTrigger } from "./ui/sidebar";
import { createCanvas, createNode, type CanvasDetail } from "@/lib/canvas-api";
import { useCanvasStore } from "@/stores/canvas-store";
import CustomEdge from "./custom/CustomEdge";
import { PlusIcon } from "lucide-react";
import { standardizeApiError } from "@/lib/error";
import { useProvidersQuery } from "@/lib/keys-hooks";
import { useNavigate } from "@tanstack/react-router";

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

const FitViewOnLoad = ({ nodes, shouldFit }: { nodes: Node[]; shouldFit: boolean }) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (shouldFit && nodes.length > 0) {
      // Small delay to ensure nodes are rendered in the DOM
      fitView({
        padding: 0.2, // 20% padding around nodes
        minZoom: 0.2,
        maxZoom: 1.5,
        duration: 300,
      });
    }
  }, [nodes, shouldFit, fitView]);

  return null; // This component doesn't render anything
};

const NodeCanvas = ({ canvasIdFromRoute }: { canvasIdFromRoute?: string }) => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isPaneInteractive, setIsPaneInteractive] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const {
    selectedCanvasId,
    currentCanvas,
    nodes: structuralNodes,
    addNode,
    setSelectedCanvasId,
    loadCanvas,
    // nodesById,
    // setNodes: setStructuralNodes,
    // resetNodes,
  } = useCanvasStore();
  const [shouldFitView, setShouldFitView] = useState(false);

  // server ids
  const [canvasId, setCanvasId] = useState<string | null>(null);
  const addNodeOnHandleClickRef =
    useRef<(sourceNodeId: string, handleType: "source" | "target", handlePosition: "left" | "right") => Promise<void>>(
      undefined
    );
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
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const { data: availableProviders = [], isLoading } = useProvidersQuery();
  const navigate = useNavigate();
  const [hasNoProviderSetup, setHasNoProviderSetup] = useState(true);
  const hasInitializedRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Function to build nodeIdMap (ReactFlow ID -> DB ID)
  // Use ref to avoid circular dependency - this function doesn't need to change
  const getNodeIdMap = useCallback((): Map<string, string> => {
    const map = new Map<string, string>();
    nodesRef.current.forEach((node) => {
      const dbNodeId = (node.data as ChatNodeData).dbNodeId;
      if (dbNodeId) {
        map.set(node.id, dbNodeId);
      }
    });
    return map;
  }, []); // No dependencies - uses ref

  // Add ref to track if initialization has started
  // const initStarted = useRef(false);

  // Hydrate canvas whenever a canvas is selected

  // Update window dimensions and recalculate node positions
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    console.log("window-size", windowDimensions);
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!isLoading && availableProviders.length === 0) {
      setHasNoProviderSetup(true);
      toast("You have to add keys to chat", {
        description: "Please configure provider and api-key to chat.",
        action: {
          label: "Add",
          onClick: () => navigate({ to: "/account/your_keys" }),
        },
      });
    } else {
      setHasNoProviderSetup(false);
    }
  }, [availableProviders, navigate, isLoading]);
  useEffect(() => {
    if (!canvasIdFromRoute && !hasInitializedRef.current && nodes.length === 0) {
      hasInitializedRef.current = true;
      addChatNode().catch((error: unknown) => {
        console.error("Failed to create initial node:", error);
        hasInitializedRef.current = false;
      });
    }
  }, [canvasIdFromRoute]);

  // Update initial node position when window dimensions change
  // useEffect(() => {
  //   if (windowDimensions.width > 0 && windowDimensions.height > 0) {
  //     setNodes((prevNodes) =>
  //       prevNodes.map((node) => (node.id === "0" ? { ...node, position: getCenterPosition() } : node))
  //     );
  //   }
  // }, [windowDimensions]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        // Only update data if needed - don't recreate everything
        return updated.map((node) => ({
          ...node,
          position: { ...node.position },
          data: {
            ...(node.data as ChatNodeData),
            // Only update edges/getNodeIdMap if they're missing
            edges: (node.data as ChatNodeData).edges ?? edgesRef.current,
            getNodeIdMap: (node.data as ChatNodeData).getNodeIdMap ?? getNodeIdMap,
          },
        }));
      });
    },
    [getNodeIdMap]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        edgesRef.current = updated;
        // Only update nodes if edges actually changed (not just position updates)
        const hasStructuralChange = changes.some(
          (change) => change.type === "add" || change.type === "remove" || change.type === "select"
        );

        if (hasStructuralChange) {
          // Update all nodes with new edges only when structure changes
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              data: {
                ...(node.data as ChatNodeData),
                edges: updated,
                getNodeIdMap,
              },
            }))
          );
        }
        return updated;
      });
    },
    [getNodeIdMap]
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // const sourceNode = structuralNodes.find((n) => n.id === params.source);
      // const targetNode = structuralNodes.find((n) => n.id === params.target);

      setEdges((eds) => {
        const updated = addEdge(params, eds);
        edgesRef.current = updated;
        // Update all nodes with new edges (edge was added)
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...(node.data as ChatNodeData),
              edges: [...updated],
              getNodeIdMap: (node.data as ChatNodeData).getNodeIdMap ?? getNodeIdMap,
            },
          }))
        );
        return updated;
      });
    },
    [nodes, getNodeIdMap]
  );

  const addChatNode = async () => {
    if (nodes.length > 9) {
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
          x: lastNode.position.x + 800,
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
          onTopHandleClick: addNodeOnHandleClick,
          edges: edgesRef.current,
          getNodeIdMap,
        },
      };
      setNodes((nds) => {
        // Just add the new node - don't update all nodes unnecessarily
        return [...nds, newNode];
      });
      nodeId++;
    } catch (e) {
      console.log("err", e);
      toast("Failded to create node");
    }
  };

  const initializeNodeInDb = useCallback(
    async (nodeId: string, label: string) => {
      try {
        let currentCanvasId = canvasId;

        if (!currentCanvasId) {
          const ownCanvas = await createCanvas({});
          currentCanvasId = ownCanvas.id;
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

        // Add to structural nodes store
        addNode({
          id: nodeData.id,
          label: nodeData.label,
          provider: nodeData.provider,
          model: nodeData.model,
          createdAt: nodeData.createdAt,
          updatedAt: nodeData.createdAt,
          messages: [],
        });

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
                    // Ensure edges and getNodeIdMap are still present (use existing or current)
                    edges: (n.data as ChatNodeData).edges ?? edgesRef.current,
                    getNodeIdMap: (n.data as ChatNodeData).getNodeIdMap ?? getNodeIdMap,
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
    [canvasId, addNode, getNodeIdMap]
  );

  const addNodeOnHandleClick = useCallback(
    async (sourceNodeId: string, handleType: "source" | "target", handlePosition: "left" | "right") => {
      const nodes = nodesRef.current;
      // use structural Nodes and nodes combined for the desired result
      if (nodes.length > 9) {
        toast("Cannot create more nodes!", {
          description: "Max node limit reached!!",
          action: {
            label: "OK!",
            onClick: () => {},
          },
        });
        return;
      }
      try {
        const sourceNode = nodes.find((n) => n.id === sourceNodeId);
        if (!sourceNode) return;

        // Calculate pos for new node based on handle position
        let position: { x: number; y: number };
        const offSetX = 760;
        const offsetY = 0;

        if (handlePosition === "right") {
          position = {
            x: sourceNode.position.x + offSetX,
            y: sourceNode.position.y + offsetY,
          };
        } else {
          position = {
            x: sourceNode.position.x - offSetX,
            y: sourceNode.position.y + offsetY,
          };
        }

        // Create new node
        const label = `Chat Node ${nodeId}`;
        const newNode = {
          id: `${nodeId}`,
          type: "chat",
          position: position,
          data: {
            label,
            setIsPaneInteractive: setIsPanelInteractiveStable,
            onInitializeNode: initializeNodeInDb,
            onTopHandleClick: addNodeOnHandleClickRef.current,
            edges: edgesRef.current,
            getNodeIdMap,
          },
        };
        // Add the new node
        setNodes((nds) => [...nds, newNode]);

        // Create edge between source and new node
        const newEdge = {
          id: handlePosition === "right" ? `edge-${sourceNodeId}-${nodeId}` : `edge-${nodeId}-${sourceNodeId}`,
          source: handleType === "source" ? sourceNodeId : `${nodeId}`,
          target: handleType === "source" ? `${nodeId}` : sourceNodeId,
          sourceHandle: "right-handle",
          targetHandle: "left-handle",
          type: "custom", // Use your custom edge type if you have one
        };

        setEdges((eds) => {
          const updated = [...eds, newEdge];
          edgesRef.current = updated;
          // Update all nodes with new edges (edge was added)
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              data: {
                ...(node.data as ChatNodeData),
                edges: updated,
                getNodeIdMap,
              },
            }))
          );
          return updated;
        });

        // console.log("🔗 Created new node and edge:", {
        //   sourceNodeId,
        //   newNodeId: `${nodeId}`,
        //   edge: newEdge,
        // });

        nodeId++;
      } catch (error) {
        const apiErr = standardizeApiError(error);
        toast("Failed to initialize node", { description: apiErr.message });
        console.error("err-", apiErr);
      }
    },
    [setIsPanelInteractiveStable, initializeNodeInDb, structuralNodes, getNodeIdMap]
  );

  addNodeOnHandleClickRef.current = addNodeOnHandleClick;

  const hydrateNodes = useCallback(
    (detailNodes: CanvasDetail["nodes"]) =>
      (detailNodes || []).map((node, idx) => ({
        id: String(node.id),
        type: "chat",
        position: {
          // x: node?.position?.x ?? getCenterPosition().x + idx * 40,
          // y: node?.position?.y ?? getCenterPosition().y + idx * 40,
          x: 500 + idx * 760,
          y: 500 + 0,
        },
        data: {
          label: String(node.label),
          // conversationId: detail?.conversation.id,
          dbNodeId: String(node.id),
          provider: String(node.provider),
          model: String(node.model),
          setIsPaneInteractive: setIsPanelInteractiveStable,
          initialMessages: node.messages ? [...node.messages] : [],
          onTopHandleClick: addNodeOnHandleClickRef.current,
          edges: edgesRef.current,
          getNodeIdMap,
        },
      })),
    [setIsPanelInteractiveStable, getNodeIdMap]
  );

  useEffect(() => {
    if (!selectedCanvasId || !currentCanvas || currentCanvas.canvas.id !== selectedCanvasId) {
      return;
    }
    // setConversationId(detail.conversation.id);
    setCanvasId(currentCanvas.canvas?.id ?? null);
    setEdges([]);
    nodeId = currentCanvas.nodes?.length + 1 || 1;
    // const hydrated = hydrateNodes(detail.nodes);
    setShouldFitView(true);
    const hydratedNodes = hydrateNodes(currentCanvas.nodes);
    nodesRef.current = hydratedNodes;
    setNodes(hydratedNodes);

    return () => {
      setCanvasId(null);
      setNodes([]);
      setEdges([]);
      setShouldFitView(false);
    };
  }, [selectedCanvasId, currentCanvas, hydrateNodes]);

  useEffect(() => {
    if (!canvasIdFromRoute) return;
    // if (canvasIdFromRoute !== selectedCanvasId && canvasIdFromRoute !== currentCanvas?.canvas?.id) {
    // Load canvas from route param
    setSelectedCanvasId(canvasIdFromRoute);

    loadCanvas(canvasIdFromRoute)
      .then((res) => {
        if (!res.status) {
          toast("Canvas not found", {
            description: "The canvas you're trying to view doesn't exist.",
          });
          setSelectedCanvasId(null);
        }
      })
      .catch((err) => {
        console.log("err - while loading canvas from id", err);
      });
    // }
    setShouldFitView(true);

    return () => {
      setCanvasId(null);
      setShouldFitView(false);
    };
  }, [canvasIdFromRoute]);

  useEffect(() => {
    if (shouldFitView) {
      // Reset after a delay so fitView can execute
      const timer = setTimeout(() => {
        setShouldFitView(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldFitView]);

  // const nodeClassName = (node: typeof ChatNode) => node.type;

  return (
    <div className="h-screen" style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <div className="absolute top-3 left-3 rounded-lg flex items-center gap-3 px-3 py-3 bg-zinc-900 z-5">
        <SidebarTrigger className="p-3! rounded-md z-30 bg-zinc-900 hover:bg-zinc-700/30 border border-zinc-800" />
        <button
          onClick={addChatNode}
          className="bg-zinc-900 hover:bg-zinc-700/30 rounded-md border border-zinc-800 backdrop-blur-[1px] flex items-center gap-[6px] group"
          style={{
            zIndex: 10,
            padding: "4px 12px",
            cursor: "pointer",
          }}
        >
          <span className="group-hover:rotate-90 duration-300 ease-out">
            <PlusIcon className="text-zinc-200 size-5" />
          </span>
          Add Node
        </button>
        {hasNoProviderSetup && (
          <button
            className="bg-zinc-900 hover:bg-zinc-700/30 rounded-md border border-zinc-800 flex items-center gap-[6px] z-10 px-3 py-1 cursor-pointer animate-pulse"
            onClick={() => navigate({ to: "/account/your_keys" })}
          >
            Configure keys
          </button>
        )}
      </div>

      <ReactFlow
        // onNodeDragStop={(_, node) => {
        //   console.log("node drag stopped", node);
        // }}
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
        // CONTROLLING REACT FLOW'S PROPS with our state.
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
        <Controls className="absolute top-[45%] left-1" />
        <MiniMap
          zoomable
          pannable
          color="dark"
          style={{ background: "#0b0b0c", border: "1px solid #1f1f1f" }}
          maskColor="rgba(20,20,20,0.6)"
          nodeColor={() => "#7dd3fc"}
          nodeStrokeColor={() => "#1f9cf0"}
        />
        <FitViewOnLoad nodes={nodes} shouldFit={shouldFitView} />
      </ReactFlow>
    </div>
  );
};

export default NodeCanvas;
