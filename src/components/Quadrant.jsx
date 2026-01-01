function Quadrant({ title, children, onZoom, isZoomed }) {
  return (
    <div style={styles.box}>
      <div style={styles.header}>
        <span>{title}</span>

        <button onClick={onZoom} style={styles.zoomBtn}>
          {isZoomed ? "⤢" : "⤢"}
        </button>
      </div>

      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  box: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    background: "#f0f0f0",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
  },
  zoomBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  content: {
    flex: 1,
    minHeight: 0,
    position: "relative",
  },
};

export default Quadrant;
