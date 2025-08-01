import React from 'react';
import { Handle, Position } from 'reactflow';

const ChatNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className='chat-node flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl min-w-[35rem] min-h-[50vh]'>
            <Handle type="target" position={Position.Left} className='!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-left-[6px]' />
            <div className='flex gap-2 items-center text-zinc-600 w-full border-b border-zinc-700 rounded-t-xl px-2 py-2'>
                <div className='w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear' />
                <div>{data.label}</div>
                <div className='ml-auto w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell' />
            </div>
            {/* Chat space */}
            <div className='p-2 grow border border-amber-200'
                onWheel={(e) => {
                    console.log("e-->", e);
                    const target = e.target as HTMLElement;
                    e.preventDefault();
                    e.stopPropagation();
                    // Only block the event if it’s from the textarea or inside it
                    if (target.closest('textarea')) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            >
                <textarea
                    className='nodrag fixed left-0 bottom-0 mt-10 text-zinc-300 outline-none border-t border-zinc-600 px-3 py-3 rounded-b-xl'
                    placeholder="Ask a question.."
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                        resize: 'none'
                    }}
                    onWheel={(e) => {
                        console.log("e-->", e);
                        // Prevent React Flow zoom behavior on touchpad gestures
                        if (e.ctrlKey || Math.abs(e.deltaY) > 0) {
                            e.preventDefault();    // ✋ Prevent browser gesture default
                            e.stopPropagation();   // 🧼 Stop it from reaching React Flow
                        }
                    }}
                />
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className='!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-right-[6px]'
            />
        </div>
    );
};

export default ChatNode;