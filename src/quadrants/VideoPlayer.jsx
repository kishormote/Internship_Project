import ReactPlayer from "react-player";

function VideoPlayer() {
  return (
    <div style={{ height: "100%" }}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=Xe8CkYZvCig"
        width="100%"
        height="100%"
        controls
      />
    </div>
  );
}

export default VideoPlayer;
