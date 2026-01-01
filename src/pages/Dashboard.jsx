import { useRef, useState, useEffect } from "react";
import GridLayout from "react-grid-layout";

import Header from "../components/Header";
import LessonSidebar from "../components/LessonSidebar";
import ReinforcementMeter from "../components/ReinforcementMeter";
import Quadrant from "../components/Quadrant";

import VideoPlayer from "../quadrants/VideoPlayer";
import Whiteboard from "../quadrants/Whiteboard";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PDFViewer from "../quadrants/PDFViewer";


function Dashboard() {
  const containerRef = useRef(null);
  const [rowHeight, setRowHeight] = useState(100);
const [zoomed, setZoomed] = useState(null);


  useEffect(() => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    setRowHeight(height / 2); // 2 rows → top and bottom
  }, []);

  // Fixed 2x2 layout
  const layout = [
    { i: "q1", x: 0, y: 0, w: 6, h: 1, static: true },
    { i: "q2", x: 6, y: 0, w: 6, h: 1, static: true },
    { i: "q3", x: 0, y: 1, w: 6, h: 1, static: true },
    { i: "q4", x: 6, y: 1, w: 6, h: 1, static: true },
  ];
  const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh", // ✅ make page full screen height
  },
  main: {
    display: "flex",
    flex: 1,        // ✅ take remaining height after header
    minHeight: 0,   // ✅ important for flex children
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,   // ✅ important for child grid to stretch
    overflow: "hidden",
  },
};


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
      />
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

export default Dashboard;

// const styles = {
//   page: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//   },
   
//   main: {
//     display: "flex",
//     flex: 1,
//     overflow: "hidden",
//   },
//   content: {
//     flex: 1,
//     padding: "10px",
//     overflow: "hidden",
//   },
// };
