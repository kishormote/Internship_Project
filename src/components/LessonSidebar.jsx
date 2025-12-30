function LessonSidebar() {
  return (
    <aside style={styles.sidebar}>
      <h3>Lessons</h3>
      <ul>
        <li>Basic Shapes - Unit 1</li>
        <li>Colors - Unit 2</li>
        <li>Numbers - Unit 3</li>
      </ul>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    padding: "15px",
    borderRight: "1px solid #ddd",
    background: "#fafafa",
  },
};

export default LessonSidebar;
