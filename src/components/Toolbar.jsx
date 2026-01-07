export default function Toolbar({
  tool,
  setTool,
  clearBoard,
  uploadImage,
}) {
  return (
    <div style={styles.toolbar}>
      <button onClick={() => setTool("pen")}>✏️</button>
      <button onClick={() => setTool("eraser")}>🧽</button>
      <button onClick={() => setTool("rect")}>⬛</button>
      <button onClick={() => setTool("arrow")}>➡️</button>

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
      />

      <button onClick={clearBoard}>🗑️</button>
    </div>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    background: "#f5f5f5",
    borderBottom: "1px solid #ccc",
  },
};
