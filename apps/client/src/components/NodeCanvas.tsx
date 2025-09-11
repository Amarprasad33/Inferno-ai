import { useState, useCallback, useEffect } from 'react';
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
} from 'reactflow';
import type {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import ChatNode from './ChatNode';
import { toast } from 'sonner';


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
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

    // Calculate center position based on window dimensions
    const getCenterPosition = () => {
        const centerX = (windowDimensions.width - 280) / 2 - 140; // 100px offset to the left
        const centerY = (windowDimensions.height - 400) / 2 - 10; // 50px offset to the top
        return { x: Math.max(0, centerX), y: Math.max(0, centerY) };
    };

    const initialNodes: Node<{ label: string; setIsPaneInteractive: (interactive: boolean) => void; }>[] = [
        {
            id: '0',
            type: 'chat',
            position: getCenterPosition(),
            data: {
                label: 'Chat Node',
                setIsPaneInteractive: setIsPaneInteractive
            },
        },
    ];
    const [nodes, setNodes] = useState<Node<{ label: string }>[]>(initialNodes);

    // Update window dimensions and recalculate node positions
    useEffect(() => {
        const updateDimensions = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Cleanup
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Update initial node position when window dimensions change
    useEffect(() => {
        if (windowDimensions.width > 0 && windowDimensions.height > 0) {
            setNodes(prevNodes =>
                prevNodes.map(node =>
                    node.id === '0'
                        ? { ...node, position: getCenterPosition() }
                        : node
                )
            );
        }
    }, [windowDimensions]);


    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    const addChatNode = () => {
        if (nodes.length > 5) {
            toast("Cannot create more nodes", {
                description: 'Max node limit reached!!',
                action: {
                    label: "OK!",
                    onClick: () => { },
                },
            });
            return;
        }
        const newNode = {
            id: `${nodeId}`,
            type: 'chat',
            position: {
                // Spawns nodes over a larger area
                x: Math.random() * 800,
                y: Math.random() * 800,
            },
            data: {
                label: `Chat Node ${nodeId}`,
                setIsPaneInteractive: setIsPaneInteractive
            },
        };
        setNodes((nds) => [...nds, newNode]);
        nodeId++; // Increment after creating the node
    };

    // useEffect(() => {
    //     console.log("i-->", isPaneInteractive);
    // }, [isPaneInteractive])

    return (
        // --- FIX IS HERE ---
        // The height is now 200% of the viewport height, creating a large scrollable area.
        <div
            style={{ height: '100vh', width: '100%', position: 'relative' }}
        >
            <button
                onClick={addChatNode}
                className='bg-[rgb(99 99 99 / 5%)] hover:bg-zinc-700/30 rounded-lg border border-zinc-800 backdrop-blur-[1px]'
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    padding: '8px 12px',
                    cursor: 'pointer',
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
                <Controls className='absolute top-[50%] left-1' />
            </ReactFlow>
        </div>
    );
};


export default NodeCanvas;