import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import Konva from 'konva';
import "../routes/exp/infini.css"
import { Html } from 'react-konva-utils';

const KonvaCanvasChatGroup = () => {
    // State for stage position and scale
    const [stage, setStage] = useState({
        scale: { x: 1, y: 1 },
        x: 0,
        y: 0,
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage | null>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [chatPos, setChatPos] = useState({ x: 100, y: 100 });
    const [chatScale, setChatScale] = useState(1);
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    // Chat window dimensions for clamping
    const CHAT_WIDTH = 300;
    // Estimate based on styles: padding + header + padding + textarea + padding
    const CHAT_HEIGHT = 10 + 35 + 10 + 100 + 10;

    useEffect(() => {
        function updateSize() {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // This effect prevents the default browser zoom when using touchpad pinch gesture
    // useEffect(() => {
    //     const container = containerRef.current;
    //     if (!container) return;

    //     const preventBrowserZoom = (e: WheelEvent) => {
    //         // The 'ctrlKey' flag is often true during a pinch-to-zoom gesture on a touchpad.
    //         // Preventing the default action stops the entire page from scaling.
    //         if (e.ctrlKey) {
    //             e.preventDefault();
    //         }
    //     };

    //     // We add the listener to the main container div.
    //     // The `{ passive: false }` option is crucial for `preventDefault` to work reliably.
    //     container.addEventListener('wheel', preventBrowserZoom, { passive: false });

    //     return () => {
    //         container.removeEventListener('wheel', preventBrowserZoom);
    //     };
    // }, []);


    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        // Prevent page scrolling
        e.evt.preventDefault();

        const scaleBy = 1.05; // Reduced sensitivity from 1.1
        const stage = e.target.getStage();
        if (!stage) {
            return;
        }
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) {
            return;
        }

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // How to scale? Zoom in? Or zoom out?
        const direction = e.evt.deltaY > 0 ? -1 : 1;

        // Apply scaling
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setStage({
            scale: { x: newScale, y: newScale },
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
        setChatScale(newScale); // Add this line
    };

    const transformCanvasToScreen = (point: { x: number; y: number }, stageTransform: { x: number, y: number, scale: { x: number, y: number } }) => {
        const { x: stageX, y: stageY, scale } = stageTransform;
        return {
            x: point.x * scale.x + stageX,
            y: point.y * scale.y + stageY,
        };
    };

    const transformScreenToCanvas = (point: { x: number; y: number }, stageTransform: { x: number, y: number, scale: { x: number, y: number } }) => {
        const { x: stageX, y: stageY, scale } = stageTransform;
        return {
            x: (point.x - stageX) / scale.x,
            y: (point.y - stageY) / scale.y,
        };
    };


    const screenPos = transformCanvasToScreen(chatPos, stage);

    return (
        <div
            ref={containerRef}
            className="cursor-grab active:cursor-grabbing h-full w-full relative overflow-hidden bg-[#2d2d2d]"
        >
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onWheel={handleWheel}
                // Draggable lets us pan the stage
                draggable
                // The following props are controlled by our state
                x={stage.x}
                y={stage.y}
                scaleX={stage.scale.x}
                scaleY={stage.scale.y}
                id='stage'
                onDragMove={e => {
                    setStage(prev => ({
                        ...prev,
                        x: e.target.x(),
                        y: e.target.y(),
                    }));
                }}
                onDragEnd={e => {
                    setStage(prev => ({
                        ...prev,
                        x: e.target.x(),
                        y: e.target.y(),
                    }));
                }}
                ref={stageRef}
            >

                {/* A Layer is like a transparent canvas sheet for drawing on */}
                <Layer>
                    {/* <Rect
                        x={20}
                        y={50}
                        width={100}
                        height={100}
                        fill="red"
                        shadowBlur={5}
                    />

                    <Text
                        text="Welcome to your AI Canvas!"
                        x={250}
                        y={70}
                        fontSize={24}
                        fontFamily="Calibri"
                        fill="white"
                    />
                    <Text
                        text="Scroll to Zoom, Drag to Pan"
                        x={250}
                        y={100}
                        fontSize={18}
                        fill="grey"
                    /> */}
                    <Html
                        divProps={{
                            style: {
                                position: 'absolute',
                                left: `${screenPos.x}px`,
                                top: `${screenPos.y}px`,
                                transform: `scale(${chatScale})`,
                                transformOrigin: 'top left',
                                width: `${CHAT_WIDTH}px`,
                                padding: '10px',
                                background: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                overflow: 'auto',
                                pointerEvents: 'auto',
                                resize: 'none',
                            },
                        }}
                    >
                        <div style={{ userSelect: 'none' }}>
                            {/* Header bar for dragging */}
                            <div
                                style={{
                                    backgroundColor: '#eee',
                                    padding: '8px',
                                    cursor: 'grab',
                                    fontWeight: 'bold',
                                    color: '#000'
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const initialChatPos = { ...chatPos };

                                    const pointerStart = transformScreenToCanvas({ x: e.clientX, y: e.clientY }, stage);
                                    dragStartPos.current = pointerStart;

                                    const onMouseMove = (moveEvent: MouseEvent) => {
                                        if (!dragStartPos.current) return;

                                        const currentPointer = transformScreenToCanvas({ x: moveEvent.clientX, y: moveEvent.clientY }, stage);

                                        const dx = currentPointer.x - dragStartPos.current.x;
                                        const dy = currentPointer.y - dragStartPos.current.y;
                                        
                                        const newWorldPos = {
                                            x: initialChatPos.x + dx,
                                            y: initialChatPos.y + dy,
                                        };
                                        
                                        // --- Clamping logic ---
                                        const newScreenPos = transformCanvasToScreen(newWorldPos, stage);
                                        
                                        const scaledChatWidth = CHAT_WIDTH * chatScale;
                                        const scaledChatHeight = CHAT_HEIGHT * chatScale;

                                        const clampedScreenX = Math.max(0, Math.min(newScreenPos.x, dimensions.width - scaledChatWidth));
                                        const clampedScreenY = Math.max(0, Math.min(newScreenPos.y, dimensions.height - scaledChatHeight));

                                        const clampedWorldPos = transformScreenToCanvas({ x: clampedScreenX, y: clampedScreenY }, stage);

                                        setChatPos(clampedWorldPos);
                                    };

                                    const onMouseUp = () => {
                                        dragStartPos.current = null;
                                        window.removeEventListener('mousemove', onMouseMove);
                                        window.removeEventListener('mouseup', onMouseUp);
                                    };

                                    window.addEventListener('mousemove', onMouseMove);
                                    window.addEventListener('mouseup', onMouseUp);
                                }}
                            >
                                Chat Window H
                            </div>

                            {/* Chat body */}
                            <div style={{ padding: '10px' }}>
                                <textarea
                                    placeholder="Type here..."
                                    className="text-zinc-900"
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        fontSize: '14px',
                                        resize: 'none',
                                    }}
                                />
                            </div>
                        </div>
                    </Html>
                </Layer>
            </Stage>
        </div>
    );
};

export default KonvaCanvasChatGroup;