function Quadrant({ title, children }) {
  return (
    <div style={styles.box}>
      <div style={styles.header}>{title}</div>
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  box: {
    height: "100%",
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
  },
  content: {
    flex: 1,
  },
};

export default Quadrant;
