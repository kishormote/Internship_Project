import { useState } from "react";

function ReinforcementMeter() {
  const [value, setValue] = useState(50);

  return (
    <div style={styles.container}>
      <span>Reinforcement</span>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <span>Current Rating: {value}%</span>
    </div>
  );
}

const styles = {
  container: {
    height: "50px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    borderTop: "1px solid #ddd",
    background: "#f5f5f5",
  },
};

export default ReinforcementMeter;
