import React from 'react';
import { Handle, Position } from 'reactflow';

const ChatNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className='bg-zinc-900 border border-zinc-700 rounded-xl p-4 min-w-[20rem] '>
            <Handle type="target" position={Position.Left} />
            <div className='text-zinc-600'>
                {data.label}
            </div>
            <div style={{ padding: '8px' }}>
                <textarea
                    className='text-zinc-500 outline-none nodrag'
                    placeholder="Type something..."
                    style={{ width: '100%', height: '80px', border: '1px solid #ddd' }}
                />
            </div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default ChatNode;