import React from 'react';
import { Handle, Position } from 'reactflow';

const ChatNode = ({ data }: { data: { label: string } }) => {
    return (
        <div style={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            width: '250px',
        }}>
            <Handle type="target" position={Position.Left} />
            <div style={{
                background: '#eee',
                padding: '8px',
                borderRadius: '4px 4px 0 0',
                fontWeight: 'bold',
            }}>
                {data.label}
            </div>
            <div style={{ padding: '8px' }}>
                <textarea
                    placeholder="Type something..."
                    style={{ width: '100%', height: '80px', border: '1px solid #ddd' }}
                />
            </div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default ChatNode;