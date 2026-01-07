import { useState } from "react";

import Header from "../components/Header";
import LessonSidebar from "../components/LessonSidebar";
import ReinforcementMeter from "../components/ReinforcementMeter";
import Quadrant from "../components/Quadrant";

import VideoPlayer from "../quadrants/VideoPlayer";
import Whiteboard from "../quadrants/Whiteboard";
import PDFViewer from "../quadrants/PDFViewer";
import ZoomClass from "../quadrants/ZoomClass";

function Dashboard() {
  const [zoomed, setZoomed] = useState(null);

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.main}>
        <LessonSidebar />

        <div style={styles.content}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: zoomed ? "1fr" : "1fr 1fr",
              gridTemplateRows: zoomed ? "1fr" : "1fr 1fr",
              gap: "10px",
              width: "100%",
              height: "100%",
            }}
          >
            {(!zoomed || zoomed === "q1") && (
              <Quadrant
                title="Zoom Live Class"
                isZoomed={zoomed === "q1"}
                onZoom={() => setZoomed(zoomed === "q1" ? null : "q1")}
              >
                <ZoomClass />
              </Quadrant>
            )}

            {(!zoomed || zoomed === "q2") && (
              <Quadrant
                title="Whiteboard"
                isZoomed={zoomed === "q2"}
                onZoom={() => setZoomed(zoomed === "q2" ? null : "q2")}
              >
                <Whiteboard />
              </Quadrant>
            )}

            {(!zoomed || zoomed === "q3") && (
              <Quadrant
                title="Video Lesson"
                isZoomed={zoomed === "q3"}
                onZoom={() => setZoomed(zoomed === "q3" ? null : "q3")}
              >
                <VideoPlayer />
              </Quadrant>
            )}

            {(!zoomed || zoomed === "q4") && (
              <Quadrant
                title="PDF / Book"
                isZoomed={zoomed === "q4"}
                onZoom={() => setZoomed(zoomed === "q4" ? null : "q4")}
              >
                <PDFViewer />
              </Quadrant>
            )}
          </div>
        </div>
      </div>

      <ReinforcementMeter />
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  main: {
    display: "flex",
    flex: 1,
    minHeight: 0,
  },
  content: {
    flex: 1,
    padding: "10px",
    minHeight: 0,
  },
};

export default Dashboard;
