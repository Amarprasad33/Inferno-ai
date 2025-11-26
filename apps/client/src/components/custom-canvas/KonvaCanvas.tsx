
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import "../routes/exp/infini.css"

const KonvaCanvas = () => {
  // State for stage position and scale
  const [stage, setStage] = useState({
    scale: { x: 1, y: 1 },
    x: 0,
    y: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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
  };

  return (
    <div
      ref={containerRef}
      className="border border-red-600 cursor-grab active:cursor-grabbing h-full w-full"
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
      >
        {/* A Layer is like a transparent canvas sheet for drawing on */}
        <Layer>
          {/* A simple rectangle shape */}
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={5}
          />

          {/* A welcome text object */}
          <Text
            text="Welcome to your AI Canvas!"
            x={250}
            y={70}
            fontSize={24}
            fontFamily="Calibri"
            fill="black"
          />
          <Text
            text="Scroll to Zoom, Drag to Pan"
            x={250}
            y={100}
            fontSize={18}
            fill="grey"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;