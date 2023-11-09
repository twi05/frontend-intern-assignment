import React from 'react'
import "./style.css";
const AudioDetectShower  =({ isAudioAvailable })  => {

        return (
          <div className="audio-detail">
            {isAudioAvailable ? (
              <>
                <p>Audio is detected </p>
                <button
                  className="button"
                  onClick={() => window.alert("Upload is possible, Uploading...")}
                >
                  Upload
                </button>
              </>
            ) : (
              <>
                <p>Audio is not detected</p>
                <button
                  className="button"
                  onClick={() => window.alert("Upload is not possible (Audio not detected) ")}
                >
                  Upload
                </button>
              </>
            )}
          </div>
        );
      };

export default AudioDetectShower