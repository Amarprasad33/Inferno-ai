// import React from 'react';
import { Handle, Position } from 'reactflow';

// Update the type for our node data to include the new function
type ChatNodeData = {
    label: string;
    setIsPaneInteractive: (interactive: boolean) => void;
};

const ChatNode = ({ data }: { data: ChatNodeData }) => {
    return (
        <div className='chat-node flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl min-w-[35rem] min-h-[50vh]'>
            <Handle type="target" position={Position.Left} className='!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-left-[6px]' />
            <div className='flex gap-2 items-center text-zinc-600 w-full border-b border-zinc-700 rounded-t-xl px-2 py-2'>
                <div className='w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear' />
                <div>{data.label}</div>
                <div className='ml-auto w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear' />
            </div>
            {/* Chat Space (Main Content) */}
            {/* This container will grow to fill available space */}
            <div className='p-2 grow border flex flex-col border-amber-200'>
                {/* A div for past messages. It grows and is scrollable. */}
                <div
                    className='flex-grow overflow-y-auto'
                    // When mouse enters, disable pane zooming/panning
                    onMouseEnter={() => data.setIsPaneInteractive(false)}
                    // When mouse leaves, re-enable it
                    onMouseLeave={() => data.setIsPaneInteractive(true)}
                >
                    {/* Previous chat messages would go here. Add some content to test scrolling. */}
                    <div className='text-zinc-400 p-2'>Message 1</div>
                    <div className='text-zinc-400 p-2'>Message 2</div>
                    <div className='text-zinc-400 p-2'>Message 3</div>
                    <div className='text-zinc-400 p-2'>Message 4</div>
                    <div className='text-zinc-400 p-2'>Message 5</div>
                    <div className='text-zinc-400 p-2'>Message 6</div>
                </div>

                <textarea
                    className='nodrag flex-shrink-0 text-zinc-300 outline-none border-t border-zinc-600 px-3 py-3 rounded-b-xl'
                    placeholder="Ask a question.."
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                        resize: 'none'
                    }}
                    // Same logic as the message history div
                    onMouseEnter={() => data.setIsPaneInteractive(false)}
                    onMouseLeave={() => data.setIsPaneInteractive(true)}
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