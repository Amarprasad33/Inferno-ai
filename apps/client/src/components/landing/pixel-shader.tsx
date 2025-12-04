import React, { useEffect, useRef } from "react";

class Pixel {
  x: number;
  y: number;
  baseOpacity: number;
  breathingSpeed: number;
  breathingPhase: number;
  hasBreathing: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    // Base opacity
    this.baseOpacity = 0.04 + Math.random() * 0.04;

    // Randomly assign breathing property
    // Changed from > 0.65 (35%) to > 0.35 (65%) to make bright pixels closer together
    this.hasBreathing = Math.random() > 0.35;

    // Random speed and phase for organic feel
    this.breathingSpeed = Math.random() * 0.003 + 0.0005;
    this.breathingPhase = Math.random() * Math.PI * 2;
  }

  update(time: number /*, mouseX: number, mouseY: number */) {
    let currentOpacity = this.baseOpacity;

    // Apply breathing to selected dots
    if (this.hasBreathing) {
      const breath = (Math.sin(time * this.breathingSpeed + this.breathingPhase) + 1) / 2;
      // Add a pulse to the opacity
      currentOpacity += breath * 0.15;
    }

    // Mouse interaction commented out as requested
    /*
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hoverRadius = 250;
        
        if (dist < hoverRadius) {
          const hoverEffect = 1 - dist / hoverRadius;
          currentOpacity += Math.pow(hoverEffect, 2.5) * 0.5; 
        }
        */

    // Clamp opacity
    if (currentOpacity > 1) currentOpacity = 1;
    if (currentOpacity < 0) currentOpacity = 0;

    return currentOpacity;
  }
}

const MorePixelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Grid configuration
    const spacing = 11;
    const squareSize = 2;
    let dots: Pixel[] = [];

    const initPixels = () => {
      dots = [];
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          dots.push(new Pixel(x, y));
        }
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPixels();
    };

    // Mouse tracking commented out
    /*
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);
    */

    window.addEventListener("resize", handleResize);

    // Initial setup
    handleResize();

    // Animation Loop
    let animationFrameId: number;
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        // Removed mouseX, mouseY arguments from update call
        const opacity = dot.update(time);

        // Optimization: Only draw if visible enough
        if (opacity > 0.02) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillRect(dot.x, dot.y, squareSize, squareSize);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      // window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
};

export default MorePixelBackground;
