import React, { useState, useCallback } from 'react';
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

const initialNodes: Node<{ label: string }>[] = [
    {
        id: '1',
        type: 'chat',
        position: { x: 100, y: 100 },
        data: { label: 'Chat Node' },
    },
];

const nodeTypes = {
    chat: ChatNode,
};

let nodeId = 2;

const NodeCanvas = () => {
    const [nodes, setNodes] = useState<Node<{ label: string }>[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);

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
            data: { label: `Chat Node ${nodeId}` },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    return (
        // --- FIX IS HERE ---
        // The height is now 200% of the viewport height, creating a large scrollable area.
        <div
            style={{ height: '100vh', width: '100%' }}
            onWheel={(e) => {
                console.log("--ev-home")
                const target = e.target as HTMLElement;

                // Find out if the wheel event started inside a node
                if (target.closest('.chat-node')) {
                    console.log("-stop-node-zoom");
                    e.preventDefault(); // Block zoom
                    e.stopPropagation();
                }
            }}
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
            // The `fitView` prop has been removed to give you a wider default view.
            >
                <Background />
                <Controls className='absolute top-[50%] left-1' />
            </ReactFlow>
        </div>
    );
};


export default NodeCanvas;