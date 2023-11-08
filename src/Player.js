import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import MetaData from "./MetaData";
import mp4box from "mp4box";
import WaveSurfer from 'wavesurfer.js'
import MyWaveSurfer from "./MyWaveSurfer";
function Player() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [metaData, setMetaData] = useState({
    duration: 0,
    videoWidth: 0,
    videoHeight: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const canvasWidth = 640;
  const canvasHeight = 360;
  let canvas = null;
  let ctx = null;

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);

      //triggred when video metadata is loaded
      video.onloadedmetadata = () => {
        setMetaData((metaData) => {
          return {
            ...metaData,
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
          };
        });
      };
      const buffer =  file.arrayBuffer();
      buffer.fileStart = 0; // https://github.com/gpac/mp4box.js/blob/master/README.md#appendbufferdata
      const mp4boxfile = mp4box.createFile();
      mp4boxfile.onReady = (info) => {
        console.log("onReady");
        // setMetaData(JSON.stringify(info, null, 2));
        console.log(info);

        // getCodec(info);
      };
    }
  };
  // a function to handle play pause of video
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying((isPlaying) => !isPlaying);
    }
  };
  useEffect(() => {
    buttonRef.current.textContent = "Please upload video to see here";
    buttonRef.current.disabled = true;
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    if (!canvas || !videoRef.current) return;
    if (videoSrc) {
      buttonRef.current.disabled = false;
      buttonRef.current.textContent = "Play";

      videoRef.current.addEventListener("play", () => {
        const drawFrame = () => {
          if (!videoRef.current.paused && !videoRef.current.ended) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
          }
        };
        drawFrame();
      });
    }
  }, [videoSrc]);
  return (
    <div className="App">
      <div className="main">

        <input
          type="file"
          accept="video/*"
          className="input-file"
          id="fileInput" 
          // add an id to link the label and the input
          onChange={handleVideoSelect}
        />
        <label htmlFor="fileInput" className="custom-upload-button">
          Upload Video
        </label>
        <div
          className="canvas-meta"
          style={{
            position: "relative",
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            id="myCanvas"
          />
          <video
            ref={videoRef}
            src={videoSrc}
            controls={false}
            style={{ display: "none" }}
          />
          <button
            onClick={handlePlayPause}
            ref={buttonRef}
            className="btn"
            style={{
              position: "absolute",
              top: canvasHeight / 2,
              left: canvasWidth / 2,
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              backgroundColor: "#b7f564",
              color: "black",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              borderRadius:"6px"
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <MetaData metaData={metaData} />

        </div>
          <MyWaveSurfer audioSrc={videoSrc}/>
      </div>
    </div>
  );
}

export default Player;
