import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './style.css'
const MyWaveSurfer = ({ audioSrc }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      backend: 'WebAudio',
      responsive: true,
      waveColor: 'blue',
      progressColor: 'purple',
    });

    wavesurfer.load(audioSrc);

    return () => {  
      wavesurfer.destroy();
    };
  }, [audioSrc]);

  return <div className='waveform' ref={waveformRef} />;
};

export default MyWaveSurfer;
