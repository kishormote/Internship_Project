function Quadrant({ title, children }) {
  const styles = {
  box: {
    height: "100%",
    width: "100%",
    border: "1px solid #ccc",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "6px 10px",
    background: "#f0f0f0",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    position: "relative", // ✅ important for canvas confinement
  },
};

  return (
    <div style={styles.box}>
      <div style={styles.header}>{title}</div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}


export default Quadrant;
