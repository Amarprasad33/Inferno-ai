import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Circle, Path, Line } from 'react-konva';
import Konva from 'konva';
import { Html } from 'react-konva-utils';

// --- Type Definitions ---
interface ChatWindowData {
    id: string;
    x: number;
    y: number;
}

interface Connection {
    id: string;
    from: string; // from window ID
    to: string;   // to window ID
}

// --- Constants ---
const CHAT_WIDTH = 300;
const CHAT_HEADER_HEIGHT = 40;
const CHAT_PADDING = 10;
const CHAT_TEXTAREA_HEIGHT = 100;
const PLUG_RADIUS = 8;
const CURVE_OFFSET = 80; // Controls the "bend" of the connection line

const KonvaCanvasChatGroup = () => {
    // --- State Management ---
    const [stage, setStage] = useState({ scale: 1, x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    
    const [windows, setWindows] = useState<ChatWindowData[]>([
        { id: `window-${Date.now()}`, x: 50, y: 150 }
    ]);
    const [connections, setConnections] = useState<Connection[]>([]);

    // --- Refs and Connection-Drawing State ---
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const isConnecting = useRef<{ from: string; fromPos: { x: number; y: number } } | null>(null);
    const [newConnectionLine, setNewConnectionLine] = useState<number[] | null>(null);
    const [hoveredPlug, setHoveredPlug] = useState<string | null>(null);

    // --- Effects ---
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Global mouse listeners for drawing the connection line
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isConnecting.current || !stageRef.current) return;
            const pointer = stageRef.current.getPointerPosition();
            if (!pointer) return;
            setNewConnectionLine([
                isConnecting.current.fromPos.x,
                isConnecting.current.fromPos.y,
                pointer.x,
                pointer.y
            ]);
        };

        const handleGlobalMouseUp = () => {
            if (isConnecting.current && hoveredPlug && isConnecting.current.from !== hoveredPlug) {
                setConnections(prev => [...prev, {
                    id: `conn-${Date.now()}`,
                    from: isConnecting.current!.from,
                    to: hoveredPlug
                }]);
            }
            isConnecting.current = null;
            setNewConnectionLine(null);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [hoveredPlug]);


    // --- Handlers ---
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const stage = e.target.getStage();
        if (!stage) return;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        setStage({ scale: newScale, x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
    };

    const addChatWindow = () => {
        const stageEl = stageRef.current;
        if (!stageEl) return;
        const center = {
            x: (dimensions.width / 2 - stageEl.x()) / stageEl.scaleX(),
            y: (dimensions.height / 2 - stageEl.y()) / stageEl.scaleY(),
        };
        setWindows(prev => [...prev, { id: `window-${Date.now()}`, x: center.x, y: center.y }]);
    };

    const handlePlugMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, window: ChatWindowData) => {
        e.cancelBubble = true;
        const plugPos = { x: window.x + CHAT_WIDTH, y: window.y + CHAT_HEADER_HEIGHT / 2 };
        isConnecting.current = { from: window.id, fromPos: plugPos };
    };

    const getPlugPosition = (win: ChatWindowData) => ({
        x: win.x + CHAT_WIDTH,
        y: win.y + CHAT_HEADER_HEIGHT / 2,
    });

    // --- Render ---
    return (
        <div ref={containerRef} className="h-full w-full relative overflow-hidden bg-[#2d2d2d]">
            <button
                onClick={addChatWindow}
                style={{
                    position: 'absolute', top: '20px', left: '20px', zIndex: 10,
                    padding: '8px 12px', fontSize: '18px', cursor: 'pointer',
                    background: '#fff', border: '1px solid #ccc', borderRadius: '50%',
                    width: '40px', height: '40px', lineHeight: '20px'
                }}
                title="Add new chat window"
            >
                +
            </button>
            <Stage
                width={dimensions.width} height={dimensions.height}
                onWheel={handleWheel}
                x={stage.x} y={stage.y}
                scaleX={stage.scale} scaleY={stage.scale}
                id='stage' draggable
                ref={stageRef}
                className="cursor-grab active:cursor-grabbing"
                onDragEnd={e => setStage(s => ({ ...s, x: e.target.x(), y: e.target.y() }))}
            >
                <Layer>
                    {/* Render connections */}
                    {connections.map(conn => {
                        const fromNode = windows.find(w => w.id === conn.from);
                        const toNode = windows.find(w => w.id === conn.to);
                        if (!fromNode || !toNode) return null;

                        const from = getPlugPosition(fromNode);
                        const to = getPlugPosition(toNode);
                        
                        const pathData = `M${from.x},${from.y} C${from.x + CURVE_OFFSET},${from.y} ${to.x - CURVE_OFFSET},${to.y} ${to.x},${to.y}`;

                        return <Path key={conn.id} data={pathData} stroke="white" strokeWidth={2} />;
                    })}
                    
                    {/* Render the line being actively drawn */}
                    {newConnectionLine && (
                        <Line
                            points={newConnectionLine}
                            stroke="cyan" strokeWidth={3} dash={[10, 5]}
                            listening={false}
                        />
                    )}

                    {/* Render all chat windows */}
                    {windows.map(window => (
                        <Group
                            key={window.id}
                            x={window.x} y={window.y}
                            draggable
                            onDragEnd={(e) => {
                                setWindows(wins => wins.map(w =>
                                    w.id === window.id ? { ...w, x: e.target.x(), y: e.target.y() } : w
                                ));
                            }}
                        >
                             <Html
                                 divProps={{
                                     style: { width: `${CHAT_WIDTH}px`, pointerEvents: 'none' }
                                 }}
                             >
                                <div style={{
                                    userSelect: 'none', background: 'white',
                                    border: '1px solid #ccc', borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                    pointerEvents: 'auto'
                                }}>
                                    {/* DRAGGABLE HEADER */}
                                    <div
                                        style={{
                                            backgroundColor: '#eee', padding: `${CHAT_PADDING}px`,
                                            cursor: 'grab', fontWeight: 'bold', color: '#333',
                                            height: `${CHAT_HEADER_HEIGHT}px`, borderTopLeftRadius: '8px',
                                            borderTopRightRadius: '8px',
                                        }}
                                    >
                                        Chat Window
                                    </div>
                                    {/* NON-DRAGGABLE BODY */}
                                    <div
                                        style={{ padding: `${CHAT_PADDING}px` }}
                                        // Stop drag from starting on the body
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <textarea
                                            placeholder="Type here..."
                                            className="text-zinc-900"
                                            style={{
                                                width: '100%', height: `${CHAT_TEXTAREA_HEIGHT}px`,
                                                fontSize: '14px', resize: 'none', border: '1px solid #ddd',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </div>
                                </div>
                            </Html>

                            {/* CONNECTION PLUG */}
                            <Circle
                                x={CHAT_WIDTH}
                                y={CHAT_HEADER_HEIGHT / 2}
                                radius={PLUG_RADIUS}
                                fill="cyan" stroke="black" strokeWidth={1}
                                onMouseDown={(e) => handlePlugMouseDown(e, window)}
                                onMouseEnter={() => setHoveredPlug(window.id)}
                                onMouseLeave={() => setHoveredPlug(null)}
                                shadowColor="black" shadowBlur={5} shadowOpacity={0.5}
                                perfectDrawEnabled={false}
                            />
                        </Group>
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default KonvaCanvasChatGroup;