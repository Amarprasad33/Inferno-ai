// import React from 'react';
import { API_BASE } from "@/lib/keys-api";
import { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";

import { appendMessage } from "@/lib/conversations-api";
import { memo } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

// Update the type for our node data to include the new function
export type ChatNodeData = {
  label: string;
  setIsPaneInteractive: (interactive: boolean) => void;
  conversationId?: string;
  dbNodeId?: string;
  initialMessages?: { role: "user" | "assistant" | "system"; content: string }[];
  onInitializeNode?: (nodeId: string, label: string) => Promise<{ conversationId: string; dbNodeId: string }>;
};

type Message = {
  text: string;
  userType: "user" | "assistant";
};

const ChatNode = memo(
  ({ data, id }: { data: ChatNodeData; id: string }) => {
    console.log("id-rec", id);
    const [messages, setMessages] = useState<Message[]>([
      // { text: "Hello! How can I help you today?", userType: "assistant" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false); // <-- loading state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
      if (input.trim() === "" || loading) return;
      console.log("data", data, "convoID", data.conversationId);
      // if (!data.conversationId || !data.dbNodeId) {
      //   console.warn("Conversation or node not ready yet.");
      //   return;
      // }
      let currentConversationId = data.conversationId;
      let currentDbNodeId = data.dbNodeId;

      if (!currentConversationId || !currentDbNodeId) {
        if (!data.onInitializeNode) {
          console.warn("Node initialization callback not available");
          return;
        }

        setLoading(true);
        try {
          const result = await data.onInitializeNode(id, data.label);
          currentConversationId = result.conversationId;
          currentDbNodeId = result.dbNodeId;
        } catch (err) {
          console.log("Failed to save the Node:", err);
          setLoading(false);
          return;
        }
        setLoading(false);
      }

      const userMsg: Message = { text: input, userType: "user" };
      setMessages((prev) => [...prev, userMsg]);
      // Make the API request to /chat
      try {
        // Append user message to conversation
        await appendMessage(currentConversationId, { nodeId: currentDbNodeId, role: "user", content: userMsg.text });

        // Transforming existing messages to the ChatBody format - send to inference ai and stream back
        const chatMessages = [...messages, userMsg].map((m) => ({
          role: m.userType === "user" ? "user" : ("assistant" as const),
          content: m.text,
        }));

        const res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            provider: "groq",
            model: "groq/compound",
            messages: chatMessages,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
        }

        // Stream text response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        let assistantIndex = -1;

        setMessages((prev) => {
          assistantIndex = prev.length;
          return [...prev, { text: "", userType: "assistant" as const }];
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          assistantText += chunk;
          setMessages((prev) => {
            const next = [...prev];
            next[assistantIndex] = { ...next[assistantIndex], text: assistantText };
            return next;
          });
        }
        console.log("assistant-text--", assistantText);

        // Append assistant message after stream completes
        if (assistantText) {
          await appendMessage(currentConversationId, {
            nodeId: currentDbNodeId,
            role: "assistant",
            content: assistantText,
          });
        }
      } catch (er) {
        console.log("err", er);
      } finally {
        console.log("finally block");
        setInput("");
        setLoading(true);
        setLoading(false);
      }

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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    // To render the chat nodes from history
    const normalizeMessages = (messages?: ChatNodeData["initialMessages"]) =>
      messages && messages.length > 0
        ? messages.map((msg: any) => ({
            text: msg.content,
            userType: msg.role === "user" ? ("user" as const) : ("assistant" as const),
          }))
        : [];

    useEffect(() => {
      setMessages(normalizeMessages(data.initialMessages));
    }, [data.initialMessages]);

    useEffect(() => {
      console.log("chatNode-data", data);
    }, [data]);
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
      <div className="chat-node flex flex-col bg-[#121212] border border-zinc-800 rounded-xl min-w-[35rem] min-h-[50vh] max-w-[800px]">
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-left-[6px]"
        />
        <div className="flex gap-2 justify-between items-center text-zinc-600 w-full rounded-t-xl px-2 py-2">
          <div className="w-5 h-5 bg-inherit flex items-center justify-center rounded-full border border-[#A6A6A6] cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear">
            <svg
              className="w-3 h-3"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.67683 1.57323C3.70007 1.59645 3.71851 1.62402 3.73109 1.65437C3.74367 1.68472 3.75015 1.71725 3.75015 1.7501C3.75015 1.78296 3.74367 1.81549 3.73109 1.84584C3.71851 1.87619 3.70007 1.90376 3.67683 1.92698L1.85339 3.75011L6.74995 3.7501C6.81626 3.7501 6.87985 3.77644 6.92673 3.82333C6.97361 3.87021 6.99995 3.9338 6.99995 4.0001C6.99995 4.06641 6.97361 4.13 6.92673 4.17688C6.87985 4.22377 6.81626 4.2501 6.74995 4.2501L1.85339 4.25011L3.67683 6.07323C3.72374 6.12014 3.75009 6.18376 3.75009 6.25011C3.75009 6.31645 3.72374 6.38007 3.67683 6.42698C3.62992 6.47389 3.56629 6.50024 3.49995 6.50024C3.43361 6.50024 3.36999 6.47389 3.32308 6.42698L1.07308 4.17698C1.04983 4.15376 1.03139 4.12619 1.01881 4.09584C1.00623 4.06549 0.999756 4.03296 0.999756 4.00011C0.999756 3.96725 1.00623 3.93472 1.01881 3.90437C1.03139 3.87402 1.04983 3.84645 1.07308 3.82323L3.32308 1.57323C3.3463 1.54999 3.37387 1.53155 3.40422 1.51896C3.43457 1.50638 3.4671 1.49991 3.49995 1.49991C3.53281 1.49991 3.56534 1.50638 3.59569 1.51896C3.62604 1.53155 3.65361 1.54999 3.67683 1.57323Z"
                fill="#D0D0D0"
              />
            </svg>
          </div>
          <div>{data.label}</div>
          <div className="w-5 h-5 bg-inherit flex items-center justify-center rounded-full border border-[#A6A6A6] cursor-cell hover:border-blue-500 duration-100 transition-colors ease-linear">
            <svg
              className="w-3 h-3"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.32317 1.57323C4.29993 1.59645 4.28149 1.62402 4.26891 1.65437C4.25633 1.68472 4.24985 1.71725 4.24985 1.7501C4.24985 1.78296 4.25633 1.81549 4.26891 1.84584C4.28149 1.87619 4.29993 1.90376 4.32317 1.92698L6.14661 3.75011L1.25005 3.7501C1.18374 3.7501 1.12016 3.77644 1.07327 3.82333C1.02639 3.87021 1.00005 3.9338 1.00005 4.0001C1.00005 4.06641 1.02639 4.13 1.07327 4.17688C1.12016 4.22377 1.18374 4.2501 1.25005 4.2501L6.14661 4.25011L4.32317 6.07323C4.27626 6.12014 4.24991 6.18376 4.24991 6.25011C4.24991 6.31645 4.27626 6.38007 4.32317 6.42698C4.37008 6.47389 4.43371 6.50024 4.50005 6.50024C4.56639 6.50024 4.63001 6.47389 4.67692 6.42698L6.92692 4.17698C6.95017 4.15376 6.96861 4.12619 6.98119 4.09584C6.99377 4.06549 7.00025 4.03296 7.00025 4.00011C7.00025 3.96725 6.99377 3.93472 6.98119 3.90437C6.96861 3.87402 6.95017 3.84645 6.92692 3.82323L4.67692 1.57323C4.65371 1.54999 4.62613 1.53155 4.59578 1.51896C4.56543 1.50638 4.5329 1.49991 4.50005 1.49991C4.46719 1.49991 4.43466 1.50638 4.40431 1.51896C4.37396 1.53155 4.34639 1.54999 4.32317 1.57323Z"
                fill="#D0D0D0"
              />
            </svg>
          </div>
        </div>
        {/* Chat Space (Main Content) */}
        <div className="p-2 grow flex flex-col">
          {/* Messages */}
          <div
            className="nodrag flex-grow overflow-y-auto space-y-2 w-full flex flex-col pb-14 max-h-[80vh] cursor-default"
            onMouseEnter={() => data.setIsPaneInteractive(false)}
            onMouseLeave={() => data.setIsPaneInteractive(true)}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg break-words select-text cursor-text selection:bg-white selection:text-black
                                ${
                                  msg.userType === "user"
                                    ? "bg-zinc-800 text-zinc-100 self-end max-w-[70%]"
                                    : "bg-zinc-700 text-zinc-300 self-start max-w-[65%]"
                                }`}
              >
                {/* <div
                  className={msg.userType === "assistant" ? "assistant" : "user"}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {msg.text}
                </div> */}
                {msg.userType === "assistant" ? (
                  <MarkdownRenderer content={msg.text} />
                ) : (
                  <div className="user" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <textarea
            className="nodrag flex-shrink-0 text-zinc-300 outline-none border-t border-zinc-600 px-3 py-3 rounded-b-xl"
            placeholder="Ask a question.."
            style={{
              width: "100%",
              minHeight: "100px",
              maxHeight: "180px",
              overflowY: "auto",
              resize: "none",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading} // Disable input while loading
            onMouseEnter={() => data.setIsPaneInteractive(false)}
            onMouseLeave={() => data.setIsPaneInteractive(true)}
          />
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-zinc-700 !border !border-zinc-600 !-right-[6px]"
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if id or actual data content changes
    // position updates - ReactFlow handles internally
    if (prevProps.id !== nextProps.id) return false;

    // Compare data fields that matter
    const prev = prevProps.data;
    const next = nextProps.data;

    return (
      prev.label === next.label &&
      prev.conversationId === next.conversationId &&
      prev.dbNodeId === next.dbNodeId &&
      prev.initialMessages === next.initialMessages
      // Functions are compared by reference, skipping them since they're stable
    );
  }
);

export default ChatNode;
