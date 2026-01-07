import { useEffect, useState } from "react";

export default function Reactions({ socket }) {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    socket.on("reaction", reaction => {
      setReactions(prev => [...prev, reaction]);

      // Remove after animation
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2500);
    });

    return () => socket.off("reaction");
  }, [socket]);

  const sendReaction = emoji => {
    socket.emit("reaction", {
      id: crypto.randomUUID(),
      emoji,
      x: Math.random() * 80 + 10,
      y: 80,
    });
  };

  return (
    <>
      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 50,
          background: "#fff",
          padding: 8,
          borderRadius: 8,
          display: "flex",
          gap: 6,
        }}
      >
        <button onClick={() => sendReaction("🎈")}>🎈</button>
        <button onClick={() => sendReaction("❤️")}>❤️</button>
        <button onClick={() => sendReaction("⭐")}>⭐</button>
      </div>

      {/* Floating reactions */}
      {reactions.map(r => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            left: `${r.x}%`,
            top: `${r.y}%`,
            fontSize: "28px",
            animation: "floatUp 2.5s ease-out forwards",
            pointerEvents: "none",
            zIndex: 60,
          }}
        >
          {r.emoji}
        </div>
      ))}

      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-200px);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}
