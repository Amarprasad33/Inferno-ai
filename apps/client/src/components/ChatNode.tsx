// import React from 'react';
import { API_BASE } from '@/lib/keys-api';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';

import { appendMessage } from '@/lib/conversations-api';

// Update the type for our node data to include the new function
type ChatNodeData = {
    label: string;
    setIsPaneInteractive: (interactive: boolean) => void;
    conversationId?: string;
    dbNodeId?: string;
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

    const handleSend = async () => {
        if (input.trim() === '' || loading) return;
        if (!data.conversationId || !data.dbNodeId) {
            console.warn('Conversation or node not ready yet.');
            return;
        }
        const userMsg: Message = { text: input, userType: 'user' };
        setMessages(prev => [
            ...prev,
            userMsg
        ]);
        // Make the API request to /chat
        try {
            // Append user message to conversation
            await appendMessage(data.conversationId, { nodeId: data.dbNodeId, role: 'user', content: userMsg.text });

            // Transforming existing messages to the ChatBody format - send to inference ai and stream back
            const chatMessages = [...messages, userMsg].map(m => ({
                role: m.userType === 'user' ? 'user' : 'assistant' as const,
                content: m.text
            }))

            const res = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    provider: 'groq',
                    model: 'groq/compound',
                    messages: chatMessages,
                }),
            });

            if (!res.ok || !res.body) {
                throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
            }

            // Stream text response
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantText = '';
            let assistantIndex = -1;

            setMessages(prev => {
                assistantIndex = prev.length;
                return [...prev, { text: '', userType: 'assistant' as const }];
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (!chunk) continue;
                assistantText += chunk;
                setMessages(prev => {
                    const next = [...prev];
                    next[assistantIndex] = { ...next[assistantIndex], text: assistantText };
                    return next;
                });
            }
            console.log("assistant-text--", assistantText)

            // Append assistant message after stream completes
            if (assistantText) {
                await appendMessage(data.conversationId, { nodeId: data.dbNodeId, role: 'assistant', content: assistantText });
            }

        } catch (er) {
            console.log("err", er);
        } finally {
            console.log('finally block')
        }

        setInput("");
        setLoading(true);
        setLoading(false);
        // Show "thinking" message
        // setMessages(prev => [
        //     ...prev,
        //     { text: "Bot is thinking...", userType: 'assistant' }
        // ]);
        // setTimeout(() => {
        //     setMessages(prev => {
        //         // Remove the last "thinking" message and add the real reply
        //         const msgs = prev.slice(0, -1);
        //         return [
        //             ...msgs,
        //             { text: "This is a bot reply :)", userType: 'assistant' }
        //         ];
        //     });
        //     setLoading(false); // Stop loading
        // }, 1000);
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
        <div className='chat-node flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl min-w-[35rem] min-h-[50vh] max-w-[800px]'>
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
                            className={`p-2 rounded-lg break-words select-text cursor-text selection:bg-white selection:text-black
                                ${msg.userType === 'user'
                                    ? 'bg-zinc-800 text-zinc-100 self-end max-w-[70%]'
                                    : 'bg-zinc-700 text-zinc-300 self-start max-w-[65%]'
                                }`}
                        >
                            <div
                                className={msg.userType === 'assistant' ? 'assistant' : 'user'}
                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
                                {msg.text}
                            </div>
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