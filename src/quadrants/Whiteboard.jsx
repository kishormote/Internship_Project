// src/quadrants/Whiteboard.jsx
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:3000"); // backend port

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Toolbar state
  const [color, setColor] = useState("black");
  const [tool, setTool] = useState("pen");

  // Image state
  const imageRef = useRef(null);
  const isDraggingImage = useRef(false);
  const isResizingImage = useRef(false);
  const imageOffset = useRef({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    const resizeCanvas = () => {
      const oldData = ctxRef.current?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      ctxRef.current = ctx;
      if (oldData) ctx.putImageData(oldData, 0, 0);
      redrawCanvas();
    };

    resizeCanvas();
    new ResizeObserver(resizeCanvas).observe(parent);

    // Socket listeners
    socket.on("draw", drawFromSocket);
    socket.on("clear", clearBoardFromSocket);
    socket.on("image", drawImageFromSocket);
    socket.on("image-move", (data) => {
      imageRef.current = data;
      redrawCanvas();
    });

    return () => {
      socket.off("draw");
      socket.off("clear");
      socket.off("image");
      socket.off("image-move");
    };
  }, []);

  // Draw stroke
  const drawLine = ({ x0, y0, x1, y1, color, tool }, emit) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = tool === "eraser" ? "white" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    if (emit) socket.emit("draw", { x0, y0, x1, y1, color, tool });
  };

  const drawFromSocket = (data) => drawLine(data, false);

  // Clear board
  const clearBoard = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    imageRef.current = null;
  };

  const clearBoardFromSocket = () => clearBoard();

  // Canvas coordinates
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Image helpers
  const isInsideImage = (x, y) => {
    const img = imageRef.current;
    if (!img) return false;
    return x > img.x && x < img.x + img.w && y > img.y && y < img.y + img.h;
  };

  const isOnResizeHandle = (x, y) => {
    const img = imageRef.current;
    if (!img) return false;
    return x > img.x + img.w - 15 && x < img.x + img.w && y > img.y + img.h - 15 && y < img.y + img.h;
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = { img, x: 100, y: 100, w: 300, h: 300 };
        redrawCanvas();
        socket.emit("image", reader.result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImageFromSocket = (src) => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = { img, x: 100, y: 100, w: 300, h: 300 };
      redrawCanvas();
    };
    img.src = src;
  };

  // Redraw canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image if exists
    if (imageRef.current) {
      const { img, x, y, w, h } = imageRef.current;
      ctx.drawImage(img, x, y, w, h);
      ctx.fillStyle = "blue";
      ctx.fillRect(x + w - 10, y + h - 10, 10, 10); // resize handle
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* TOOLBAR */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 10,
          background: "#fff",
          padding: "6px",
          borderRadius: "6px",
          display: "flex",
          gap: "6px",
        }}
      >
        <button onClick={() => setTool("pen")}>✏️ Pen</button>
        <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button
  onClick={() => {
    clearBoard();          // clear locally
    socket.emit("clear");  // notify backend to clear all clients
  }}
>
  🗑️ Clear
</button>
        <label style={{ cursor: "pointer" }}>
          🖼️ Image
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </label>
      </div>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", cursor: "crosshair" }}
        onMouseDown={(e) => {
          const pos = getPos(e);

          if (imageRef.current && isOnResizeHandle(pos.x, pos.y)) {
            isResizingImage.current = true;
          } else if (imageRef.current && isInsideImage(pos.x, pos.y)) {
            isDraggingImage.current = true;
            imageOffset.current = {
              x: pos.x - imageRef.current.x,
              y: pos.y - imageRef.current.y,
            };
          } else {
            drawing.current = true;
            lastPos.current = pos;
          }
        }}
        onMouseMove={(e) => {
          const pos = getPos(e);

          if (isDraggingImage.current) {
            imageRef.current.x = pos.x - imageOffset.current.x;
            imageRef.current.y = pos.y - imageOffset.current.y;
            redrawCanvas();
            socket.emit("image-move", imageRef.current);
            return;
          }

          if (isResizingImage.current) {
            imageRef.current.w = pos.x - imageRef.current.x;
            imageRef.current.h = pos.y - imageRef.current.y;
            redrawCanvas();
            socket.emit("image-move", imageRef.current);
            return;
          }

          if (!drawing.current) return;

          drawLine({ x0: lastPos.current.x, y0: lastPos.current.y, x1: pos.x, y1: pos.y, color, tool }, true);

          lastPos.current = pos;
        }}
        onMouseUp={() => {
          drawing.current = false;
          isDraggingImage.current = false;
          isResizingImage.current = false;
        }}
        onMouseLeave={() => {
          drawing.current = false;
          isDraggingImage.current = false;
          isResizingImage.current = false;
        }}
      />
    </div>
  );
}
