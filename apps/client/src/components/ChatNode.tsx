// import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

// Update the type for our node data to include the new function
type ChatNodeData = {
    label: string;
    setIsPaneInteractive: (interactive: boolean) => void;
};

type Message = {
    text: string;
    userType: 'user' | 'assistant';
}

const ChatNode = ({ data }: { data: ChatNodeData }) => {
    const [messages, setMessages] = useState<Message[]>(
        [
            { text: "Hello! How can I help you today?", userType: "assistant" }
        ]
    );
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // <-- loading state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (input.trim() === '' || loading) return;
        setMessages(prev => [
            ...prev,
            { text: input, userType: 'user' }
        ]);
        setInput("");
        setLoading(true);
        // Show "thinking" message
        setMessages(prev => [
            ...prev,
            { text: "Bot is thinking...", userType: 'assistant' }
        ]);
        setTimeout(() => {
            setMessages(prev => {
                // Remove the last "thinking" message and add the real reply
                const msgs = prev.slice(0, -1);
                return [
                    ...msgs,
                    { text: "This is a bot reply :)", userType: 'assistant' }
                ];
            });
            setLoading(false); // Stop loading
        }, 1000);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <div className='chat-node flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl min-w-[35rem] min-h-[50vh]'>
            <Handle type="target" position={Position.Left} className='!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-left-[6px]' />
            <div className='flex gap-2 items-center text-zinc-600 w-full border-b border-zinc-700 rounded-t-xl px-2 py-2'>
                <div className='w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear' />
                <div>{data.label}</div>
                <div className='ml-auto w-5 h-5 bg-inherit rounded-full border border-zinc-600 cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear' />
            </div>
            {/* Chat Space (Main Content) */}
            <div className='p-2 grow flex flex-col'>
                {/* Messages */}
                <div
                    className='nodrag flex-grow overflow-y-auto space-y-2 w-full flex flex-col pb-14 max-h-[130vh]'
                    onMouseEnter={() => data.setIsPaneInteractive(false)}
                    onMouseLeave={() => data.setIsPaneInteractive(true)}
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-2 rounded-lg max-w-[80%] break-words select-text cursor-text selection:bg-white selection:text-black
                                ${msg.userType === 'user'
                                    ? 'bg-zinc-800 text-zinc-100 self-end'
                                    : 'bg-zinc-700 text-zinc-300 self-start'
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
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
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading} // Disable input while loading
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