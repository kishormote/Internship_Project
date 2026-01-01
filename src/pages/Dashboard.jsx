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

function Dashboard() {
  const containerRef = useRef(null);
  const [rowHeight, setRowHeight] = useState(100);

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
            ref={containerRef}
            style={{ width: "100%", height: "calc(100vh - 120px)" }}
          >
            <GridLayout
              layout={layout}
              cols={12}
              rowHeight={rowHeight}
              width={containerRef.current?.clientWidth || 1200}
              isDraggable={false}
              isResizable={false}
              margin={[10, 10]}
              containerPadding={[10, 10]}
            >
              <div key="q1">
                <Quadrant title="Zoom Live Class" />
              </div>
              <div key="q2">
               <Quadrant title="Whiteboard">
  <div style={{ height: "100%", width: "100%" }}>
    <Whiteboard />
  </div>
</Quadrant>
              </div>
              <div key="q3">
                <Quadrant title="Video Lesson">
                  <VideoPlayer />
                </Quadrant>
              </div>
              <div key="q4">
                <Quadrant title="PDF / Book" />
              </div>
            </GridLayout>
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
