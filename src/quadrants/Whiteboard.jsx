import { useEffect, useRef } from "react";
import socket from "../socket";

function Whiteboard({ zoomed }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Resize canvas to parent
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  };

  useEffect(() => {
  resizeCanvas();

  socket.on("draw", (data) => {
    drawLine(data.x0, data.y0, data.x1, data.y1, false);
  });

  return () => {
    socket.off("draw");
  };
}, [zoomed]); // 🔥 RUN WHEN ZOOM CHANGES


  const drawLine = (x0, y0, x1, y1, emit) => {
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (emit) socket.emit("draw", { x0, y0, x1, y1 });
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        cursor: "crosshair",
        display: "block",
      }}
      onMouseDown={(e) => {
        drawing.current = true;
        lastPos.current = getPos(e);
      }}
      onMouseMove={(e) => {
        if (!drawing.current) return;
        const pos = getPos(e);
        drawLine(
          lastPos.current.x,
          lastPos.current.y,
          pos.x,
          pos.y,
          true
        );
        lastPos.current = pos;
      }}
      onMouseUp={() => (drawing.current = false)}
      onMouseLeave={() => (drawing.current = false)}
    />
  );
}

export default Whiteboard;
