import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import MetaData from "./MetaData";
import mp4box from "mp4box";
import MyWaveSurfer from "./MyWaveSurfer";
import AudioDetectShower from "./AudioDetectShower";
import AdvanceMetaData from "./AdvanceMetaData";
import toast, { Toaster } from "react-hot-toast";
const notify = () => toast("Upload only mp4 file!");
let canvas = null; //intializing canvas
let ctx = null; //intializing context
function Player() {
  const [videoSrc, setVideoSrc] = useState(null);
  //metaData for video, intializing with object.
  const [metaData, setMetaData] = useState({});
  //advance MetaData state from mp4box
  const [advMetaData, setAdvMetaData] = useState("");
  const [showAdvMetaData, setShowAdvMetaData] = useState(false);

  const [isAudioAvailable, setIsAudioAvailable] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const buttonRef = useRef(null);
  const canvasWidth = 640;
  const canvasHeight = 360;
  const [loading, setLoading] = useState(false);
  const handleVideoSelect = async (e) => {
    setVideoSrc(null);
    setIsAudioAvailable(null);
    const file = e.target.files[0]; //taking file input
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      //creating video element
      const video = document.createElement("video"); 
      video.src = URL.createObjectURL(file);

      //triggered when video metadata is loaded
      video.onloadedmetadata = () => {
        setLoading(true);

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const analyser = audioContext.createAnalyser();

        const gainNode = audioContext.createGain();

        gainNode.gain.value = 0;

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let isAudioAvailable = false;

        function hasAudio() {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, value) => a + value, 0);
          return sum > 0;
        }
        video.addEventListener("timeupdate", () => {
          if (!isAudioAvailable) {
            if (hasAudio()) {
              console.log("video has audio");
              buttonRef.current.disabled = false;
              //change button text based on video state
              buttonRef.current.textContent = "Play";
              isAudioAvailable = true;
            } else {
              buttonRef.current.textContent =
                "Can't Upload, Video does'nt have audio";
              console.log("video doesn't have audio");
            }
          }
        });

        setLoading(false);
        video.play();

        setMetaData((metaData) => {
          return {
            ...metaData,
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            fileName:file.name,
            fileSize:file.size,
            fileType:file.type,
            lastModifiedDate: file.lastModifiedDate,
            lastModified: file.lastModified,
          };
        });
      };

      try {
        //converting file to array buffer
        const buffer = await file.arrayBuffer();
        buffer.fileStart = 0;
        const mp4boxfile = mp4box.createFile();
        mp4boxfile.onReady = (info) => {
          console.log("onReady");
          setAdvMetaData(JSON.stringify(info, null, 2));
          
          //checking from advance metadata, audiotracks available or not
          if (info.audioTracks && info.audioTracks.length) {
            console.log("in true audiotracks");
            setIsAudioAvailable(true);
          } else {
            setIsAudioAvailable(false);
          }
        };
        mp4boxfile.onError = (error) => console.log(error);
        mp4boxfile.appendBuffer(buffer);
      } catch (err) {
        console.warn(err);
      }
    }
  };
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
    buttonRef.current.textContent = "Please Input video to see here";
    buttonRef.current.disabled = true;
  }, []);

  useEffect(() => {
    //create canvas ref
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    if (!canvas || !videoRef.current) return;
    if (videoSrc) {
      buttonRef.current.disabled = false;
      //change button text based on video state
      buttonRef.current.textContent = "Play"; 
      //videoref event listener on play
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
      {loading && <div className="loader-wrapper"><div className="loader  "></div></div> }
        <Toaster />
        <input
          type="file"
          accept="video/*"
          className="input-file"
          id="fileInput"
          // add an id to link the label and the input
          onChange={handleVideoSelect}
          onClick={notify}
        />
        <label htmlFor="fileInput" className="button">
          Input Video
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
            controls={true}
            style={{ display: "none" }}
            muted
            
          />
          <button
            onClick={handlePlayPause}
            ref={buttonRef}
            className="btn button"
            style={{
              position: "absolute",
              top: canvasHeight / 2,
              left: canvasWidth / 2,
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <MetaData
            metaData={metaData}
            advMetaData={advMetaData}
            setShowAdvMetaData={setShowAdvMetaData}
            showAdvMetaData={showAdvMetaData}
          />
        </div>
        <MyWaveSurfer audioSrc={videoSrc} isAudioAvailable={isAudioAvailable} isPlaying={isPlaying}/>
        {videoSrc && <AudioDetectShower isAudioAvailable={isAudioAvailable} />}
        {showAdvMetaData && (
          <AdvanceMetaData advMetaData={advMetaData} />
        )}
      </div>
    </div>
  );
}

export default Player;

