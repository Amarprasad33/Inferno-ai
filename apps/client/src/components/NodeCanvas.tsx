import { useState, useCallback } from 'react';
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


// The options to hide the attribution watermark.
const proOptions = {
    hideAttribution: true,
};

const nodeTypes = {
    chat: ChatNode,
};

let nodeId = 2;

const NodeCanvas = () => {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isPaneInteractive, setIsPaneInteractive] = useState(true);

    const initialNodes: Node<{ label: string; setIsPaneInteractive: (interactive: boolean) => void; }>[] = [
        {
            id: '1',
            type: 'chat',
            position: { x: 100, y: 100 },
            data: {
                label: 'Chat Node',
                setIsPaneInteractive: setIsPaneInteractive
            },
        },
    ];
    const [nodes, setNodes] = useState<Node<{ label: string }>[]>(initialNodes);



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
        const newNode = {
            id: `${nodeId++}`,
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
    };

    // useEffect(() => {
    //     console.log("i-->", isPaneInteractive);
    // }, [isPaneInteractive])

    return (
        // --- FIX IS HERE ---
        // The height is now 200% of the viewport height, creating a large scrollable area.
        <div
            style={{ height: '100vh', width: '100%' }}
        >
            <button
                onClick={addChatNode}
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