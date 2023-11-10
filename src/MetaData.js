import React from "react";
import "./style.css";
//Metadata component to show metadata to client
const MetaData = ({ showAdvMetaData, setShowAdvMetaData, metaData }) => {
  return (
    <div className="meta-data">
      <h2>Metadata</h2>

      {metaData.duration > 0 ? (
        <div className="flex">
          <Data metaData={metaData} />
          <button
            className="button more-metadata"
            onClick={() =>
              setShowAdvMetaData((showAdvMetaData) => !showAdvMetaData)
            }
          >
            Get More metadata
          </button>
        </div>
      ) : (
        <p>Input video to get meta-data </p>
      )}
    </div>
  );
};

export default MetaData;

// div component to show metadata
const Data = ({ metaData }) => {
  return (
    <>
      <p>Video Duration : {metaData.duration.toFixed(2)} seconds</p>
      <p>Video Name : {metaData.fileName}</p>
      <p>Video Type : {metaData.fileType}</p>
      <p>Video last modified: {metaData.lastModified}</p>
      <p>Video Width : {metaData.videoWidth}</p>
      <p>Video Height : {metaData.videoHeight}</p>
    </>
  );
};
