import { useState, useRef } from "react";

function Header() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        chunksRef.current = [];

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "session-recording.webm";
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Recording failed:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={styles.header}>
      <h3>Hurshbin Training Dashboard</h3>

      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          ...styles.btn,
          background: recording ? "#e53935" : "#4caf50",
        }}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}

const styles = {
  header: {
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    borderBottom: "1px solid #ccc",
    background: "#fff",
  },
  btn: {
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Header;
