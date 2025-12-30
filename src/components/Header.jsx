function Header() {
  return (
    <header style={styles.header}>
      <h2>Welcome to Hurshbin Training</h2>
      <button>Start Recording</button>
    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
};

export default Header;
