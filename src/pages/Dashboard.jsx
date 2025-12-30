import Header from "../components/Header";
import LessonSidebar from "../components/LessonSidebar";
import ReinforcementMeter from "../components/ReinforcementMeter";
import { Responsive } from "react-grid-layout";


import Quadrant from "../components/Quadrant";
import VideoPlayer from "../quadrants/VideoPlayer";
import { useRef, useState, useEffect } from "react";





function Dashboard() {

    const containerRef = useRef(null);
  const [width, setWidth] = useState(300); // default width

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.main}>
        <LessonSidebar />

        <div style={styles.content}>
  <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
    <Responsive
     width={width}
      className="layout"
      layouts={{
  lg: [
    { i: "q1", x: 0, y: 0, w: 6, h: 4, minW: 3, maxW: 12 },
    { i: "q2", x: 6, y: 0, w: 6, h: 4, minW: 3, maxW: 12 },
    { i: "q3", x: 0, y: 4, w: 6, h: 4, minW: 3, maxW: 12 },
    { i: "q4", x: 6, y: 4, w: 6, h: 4, minW: 3, maxW: 12 },
  ],
}}


      breakpoints={{ lg: 1200 }}
      cols={{ lg: 12 }}
      rowHeight={200}
      isResizable={true}
      isDraggable={true}
      measureBeforeMount={true}
      useCSSTransforms={true}
    >
      <div key="q1">
        <Quadrant title="Zoom Live Class" />
      </div>

      <div key="q2">
        <Quadrant title="Whiteboard" />
      </div>

      <div key="q3">
        <Quadrant title="Video Lesson">
          <VideoPlayer />
        </Quadrant>
      </div>

      <div key="q4">
        <Quadrant title="PDF / Book" />
      </div>
    </Responsive>
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
  },
  content: {
  flex: 1,
  padding: "10px",
  overflow: "auto",
},

};

export default Dashboard;
