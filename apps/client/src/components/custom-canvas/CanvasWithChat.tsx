import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import Konva from "konva";
import "../../routes/exp/infini.css";
import { Html } from "react-konva-utils";
// import HtmlChatWindow from './ChatWindow';

const KonvaCanvasChat = () => {
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

  useEffect(() => {
    // More 'React' way to style the canvas since it has it's own inline styles before
    // const canvas = document.querySelector('#stage .konvajs-content canvas');
    // if (canvas) {
    //   (canvas as HTMLCanvasElement).style.border = '2px solid aqua';
    // }
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // Prevent page scrolling
    e.evt.preventDefault();

    const scaleBy = 1.1;
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

  const transformCanvasToScreen = (point: { x: number; y: number }) => {
    const stage = stageRef.current?.getStage();
    if (!stage) return point;

    const scale = stage.scaleX();
    const offsetX = stage.x();
    const offsetY = stage.y();

    return {
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    };
  };

  const screenPos = transformCanvasToScreen(chatPos);

  return (
    <div ref={containerRef} className="cursor-grab active:cursor-grabbing h-full w-full relative">
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
        id="stage"
        onDragMove={(e) => {
          setStage((prev) => ({
            ...prev,
            x: e.target.x(),
            y: e.target.y(),
          }));
        }}
        onDragEnd={(e) => {
          setStage((prev) => ({
            ...prev,
            x: e.target.x(),
            y: e.target.y(),
          }));
        }}
        ref={stageRef}
      >
        {/* A Layer is like a transparent canvas sheet for drawing on */}
        <Layer>
          {/* A simple rectangle shape */}
          <Rect x={20} y={50} width={100} height={100} fill="red" shadowBlur={5} />

          {/* A welcome text object */}
          <Text text="Welcome to your AI Canvas!" x={250} y={70} fontSize={24} fontFamily="Calibri" fill="black" />
          <Text text="Scroll to Zoom, Drag to Pan" x={250} y={100} fontSize={18} fill="grey" />
          <Html
            divProps={{
              style: {
                position: "absolute",
                left: `${screenPos.x}px`,
                top: `${screenPos.y}px`,
                transform: `scale(${chatScale})`,
                transformOrigin: "top left",
                width: "300px",
                padding: "10px",
                background: "#232323",
                border: "1px solid #3f3f3f",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                overflow: "auto",
                pointerEvents: "auto",
                resize: "none",
              },
            }}
          >
            <div style={{ userSelect: "none" }}>
              {/* Header bar for dragging */}
              <div
                style={{
                  backgroundColor: "#eee",
                  padding: "8px",
                  cursor: "grab",
                  fontWeight: "bold",
                  color: "#000",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const initialChatPos = { ...chatPos };

                  const stageElement = stageRef.current?.getStage();
                  if (!stageElement) return;

                  const scale = stageElement.scaleX(); // assuming uniform scaleX == scaleY
                  const stageX = stageElement.x();
                  const stageY = stageElement.y();

                  // Convert mouse position into canvas (stage) coordinates
                  const pointerStart = {
                    x: (e.clientX - stageX) / scale,
                    y: (e.clientY - stageY) / scale,
                  };
                  dragStartPos.current = pointerStart;

                  const onMouseMove = (moveEvent: MouseEvent) => {
                    if (!dragStartPos.current) return;

                    const currentPointer = {
                      x: (moveEvent.clientX - stageX) / scale,
                      y: (moveEvent.clientY - stageY) / scale,
                    };

                    const dx = currentPointer.x - dragStartPos.current.x;
                    const dy = currentPointer.y - dragStartPos.current.y;

                    setChatPos({
                      x: initialChatPos.x + dx,
                      y: initialChatPos.y + dy,
                    });
                  };

                  const onMouseUp = () => {
                    dragStartPos.current = null;
                    window.removeEventListener("mousemove", onMouseMove);
                    window.removeEventListener("mouseup", onMouseUp);
                  };

                  window.addEventListener("mousemove", onMouseMove);
                  window.addEventListener("mouseup", onMouseUp);
                }}
              >
                Chat Window H
              </div>

              {/* Chat body */}
              <div style={{ padding: "10px" }}>
                <textarea
                  placeholder="Type here..."
                  className="text-zinc-300"
                  style={{
                    width: "100%",
                    height: "100px",
                    fontSize: "14px",
                    resize: "none",
                  }}
                />
              </div>
            </div>
          </Html>
        </Layer>
      </Stage>
      {/* --- RENDER THE HTML CHAT WINDOW HERE --- */}
    </div>
  );
};

export default KonvaCanvasChat;
