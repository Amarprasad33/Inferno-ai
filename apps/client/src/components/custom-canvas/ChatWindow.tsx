import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

type HtmlChatWindowProps = {
  worldX: number; // X position in "world" (canvas) coordinates
  worldY: number; // Y position in "world" (canvas) coordinates
  scale: number; // Local chat window scale (e.g., for zooming the chat window itself)
  stageX: number; // Canvas stage X offset (for panning)
  stageY: number; // Canvas stage Y offset (for panning)
  stageScale: number; // Canvas stage scale (for zooming the whole canvas)
  onDrag: (pos: { x: number; y: number }) => void; // Called when chat window is dragged, gives new world coordinates
  onScale: (delta: number) => void; // Called when zoom in/out is requested
};

export const HtmlChatWindow: React.FC<HtmlChatWindowProps> = ({
  worldX,
  worldY,
  scale,
  stageX,
  stageY,
  stageScale,
  onDrag,
  onScale,
}) => {
  // State for managing chat messages and user input
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I help you on this infinite canvas?" },
  ]);
  const [input, setInput] = useState("");
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Create a ref for the draggable node to fix findDOMNode error
  const nodeRef = useRef(null);

  // Function to handle sending a message
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate a bot response after a short delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "This is a placeholder response." }]);
    }, 1000);
  };

  // Effect to auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Calculate the final on-screen CSS position and scale based on canvas state
  const finalX = worldX * stageScale + stageX;
  const finalY = worldY * stageScale + stageY;
  const finalScale = scale * stageScale;

  return (
    <Draggable
      handle=".chat-header" // Only allow dragging from the header
      position={{ x: finalX, y: finalY }} // Controlled position from parent state
      onStop={(e, data) => {
        console.log("e", e);
        // When dragging stops, calculate and update the "world" coordinates in the parent
        onDrag({
          x: (data.x - stageX) / stageScale,
          y: (data.y - stageY) / stageScale,
        });
      }}
      scale={finalScale} // Apply the combined scale
      nodeRef={nodeRef} // Add ref for strict mode compatibility with react-draggable
    >
      <div
        ref={nodeRef} // Ref for Draggable
        className={`
                    absolute flex flex-col w-[320px] bg-zinc-900 rounded-xl shadow-2xl border border-slate-200
                    transition-all duration-300 ease-in-out
                    ${minimized ? "h-[48px]" : "h-[400px]"}
                `}
        style={{ transformOrigin: "top left" }} // Ensure scaling happens from the top-left corner
      >
        {/* --- Chat Header --- */}
        <div className="chat-header flex items-center justify-between px-4 py-3 bg-slate-800 text-white font-bold rounded-t-xl cursor-grab active:cursor-grabbing">
          <span>AI Assistant</span>
          <div className="controls flex items-center gap-x-2">
            <button
              onClick={() => onScale(0.1)}
              title="Zoom In"
              className="flex items-center justify-center w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              +
            </button>
            <button
              onClick={() => onScale(-0.1)}
              title="Zoom Out"
              className="flex items-center justify-center w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-xl pb-1"
            >
              –
            </button>
            <button
              onClick={() => setMinimized((m) => !m)}
              title={minimized ? "Maximize" : "Minimize"}
              className="flex items-center justify-center w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              {minimized ? "❐" : "—"}
            </button>
          </div>
        </div>

        {/* --- Chat Body (only shown if not minimized) --- */}
        {!minimized && (
          <>
            {/* --- Messages Area --- */}
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-800"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* --- Input Area --- */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-x-2 p-3 border-t border-slate-200 bg-white rounded-b-xl"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default HtmlChatWindow;
