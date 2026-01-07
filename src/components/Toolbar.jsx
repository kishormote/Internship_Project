export default function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  clearBoard,
}) {
  return (
    <div style={styles.toolbar}>
      {/* TOOLS */}
      <button onClick={() => setTool("pen")}>✏️</button>
      <button onClick={() => setTool("eraser")}>🧽</button>

      {/* COLOR PICKER */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      {/* BRUSH SIZE */}
      <input
        type="range"
        min="1"
        max="20"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      {/* CLEAR */}
      <button onClick={clearBoard}>🗑️</button>
    </div>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    background: "#f0f0f0",
    borderBottom: "1px solid #ccc",
  },
};
