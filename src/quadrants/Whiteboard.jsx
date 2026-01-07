import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Reactions from "../components/Reactions";


const socket = io("http://localhost:3001");

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // ===== TOOLS =====
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");

  // ===== IMAGES =====
  const imagesRef = useRef([]);           // authoritative image list
  const activeImageRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  /* ================= CANVAS INIT ================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    const resize = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      ctxRef.current = ctx;
      redraw();
    };

    resize();
    new ResizeObserver(resize).observe(parent);

    // ===== SOCKET EVENTS =====
    socket.on("draw", d => drawLine(d, false));
    socket.on("clear", clearFromSocket);
    socket.on("image", addImageFromSocket);
    socket.on("image-move", updateImageFromSocket);

    socket.on("sync-images", data => {
      imagesRef.current = [];
      data.forEach(d => {
        const img = new Image();
        img.onload = () => {
          imagesRef.current.push({ ...d, img });
          redraw();
        };
        img.src = d.src;
      });
    });

    return () => socket.removeAllListeners();
  }, []);

  /* ================= DRAW ================= */
  const drawLine = ({ x0, y0, x1, y1, color, tool }, emit) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = tool === "eraser" ? "#fff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    if (emit) socket.emit("draw", { x0, y0, x1, y1, color, tool });
  };

  /* ================= CLEAR ================= */
  const clearFromSocket = () => {
    const c = canvasRef.current;
    ctxRef.current.clearRect(0, 0, c.width, c.height);
    imagesRef.current = [];
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const data = {
          id: crypto.randomUUID(),
          src: reader.result,
          x: 100,
          y: 100,
          w: 300,
          h: 300,
        };

        imagesRef.current.push({ ...data, img });
        redraw();
        socket.emit("image", data);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const addImageFromSocket = data => {
    if (imagesRef.current.find(i => i.id === data.id)) return;

    const img = new Image();
    img.onload = () => {
      imagesRef.current.push({ ...data, img });
      redraw();
    };
    img.src = data.src;
  };

  /* ================= IMAGE MOVE / RESIZE ================= */
  const updateImageFromSocket = data => {
    let img = imagesRef.current.find(i => i.id === data.id);

    if (!img) {
      const image = new Image();
      image.onload = () => {
        imagesRef.current.push({ ...data, img: image });
        redraw();
      };
      image.src = data.src;
      return;
    }

    Object.assign(img, data);
    redraw();
  };

  /* ================= HELPERS ================= */
  const getPos = e => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const hitImage = (x, y) =>
    [...imagesRef.current].reverse().find(
      i => x > i.x && x < i.x + i.w && y > i.y && y < i.y + i.h
    );

  const hitResize = (img, x, y) =>
    x > img.x + img.w - 12 && y > img.y + img.h - 12;

  /* ================= REDRAW ================= */
  const redraw = () => {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, c.width, c.height);

    imagesRef.current.forEach(i => {
      ctx.drawImage(i.img, i.x, i.y, i.w, i.h);
      ctx.fillStyle = "blue";
      ctx.fillRect(i.x + i.w - 10, i.y + i.h - 10, 10, 10);
    });
  };

  /* ================= EVENTS ================= */
  const mouseDown = e => {
    const p = getPos(e);
    const img = hitImage(p.x, p.y);

    if (img) {
      activeImageRef.current = img;
      if (hitResize(img, p.x, p.y)) resizing.current = true;
      else {
        dragging.current = true;
        offset.current = { x: p.x - img.x, y: p.y - img.y };
      }
      return;
    }

    drawing.current = true;
    lastPos.current = p;
  };

  const mouseMove = e => {
    const p = getPos(e);

    if (dragging.current || resizing.current) {
      const img = activeImageRef.current;
      if (!img) return;

      if (dragging.current) {
        img.x = p.x - offset.current.x;
        img.y = p.y - offset.current.y;
      }

      if (resizing.current) {
        img.w = Math.max(50, p.x - img.x);
        img.h = Math.max(50, p.y - img.y);
      }

      redraw();
      socket.emit("image-move", {
        id: img.id,
        x: img.x,
        y: img.y,
        w: img.w,
        h: img.h,
        src: img.src,
      });
      return;
    }

    if (!drawing.current) return;

    drawLine(
      {
        x0: lastPos.current.x,
        y0: lastPos.current.y,
        x1: p.x,
        y1: p.y,
        color,
        tool,
      },
      true
    );
    lastPos.current = p;
  };

  const mouseUp = () => {
    drawing.current = false;
    dragging.current = false;
    resizing.current = false;
    activeImageRef.current = null;
  };

  /* ================= UI ================= */
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
   
      <div style={{
        position: "absolute",
        top: 8,
        left: 8,
        background: "#fff",
        padding: 6,
        zIndex: 10,
        display: "flex",
        gap: 6
      }}>
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <button onClick={() => socket.emit("clear")}>Clear</button>
        <label>
          Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", cursor: "crosshair" }}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseLeave={mouseUp}
      />
       <Reactions socket={socket} />
    </div>
  );
}
