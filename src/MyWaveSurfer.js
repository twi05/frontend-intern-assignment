import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./style.css";
let wavesurfer = null;
const MyWaveSurfer = ({ audioSrc, isAudioAvailable = false, isPlaying }) => {
  const waveformRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      //check audio is uploaded, and video has audio detected
      //(as we can only show audio once it has video)
      if (audioSrc && isAudioAvailable) {
        //create wavesurfer object
        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          // backend: "WebAudio",
          responsive: true,
          waveColor: "blue",
          progressColor: "purple",
        });

        //load audio in wavesurfer
        wavesurfer.load(audioSrc);

        //for better ux, showing loading till waves are ready
        wavesurfer.addEventListener("ready", () => setLoading(false));
        return () => {
          // destroy wavesurfer on component unmount
          wavesurfer.destroy();
        };
      }
    } catch (err) {
      console.log(err);
    }
  }, [audioSrc, isAudioAvailable]);

  useEffect(() => {
    //play wave surfer, if wavesurfer is true.
    if (wavesurfer) {
      if (isPlaying) wavesurfer.play();
      else wavesurfer.pause();
    }
  }, [isPlaying]);

  return (
    <>
      <div className="waveform" ref={waveformRef}>
        {!audioSrc && <div className="">Input video to see waveform</div>}
        {audioSrc && !isAudioAvailable ? (
          <p>Unable to show waveform, As audio is not available!</p>
        ) : null}
        {loading && audioSrc && isAudioAvailable ? (
          <p>Waveform Loading..</p>
        ) : null}
      </div>
    </>
  );
};

export default MyWaveSurfer;
