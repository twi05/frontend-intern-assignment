import React from "react";
import "./style.css";
const MetaData = ({ metaData }) => {
  return (
    <div className="meta-data">
      <h2>Metadata</h2>
      {metaData.duration>0 ? <Data metaData={metaData} /> : <p>Upload video to get meta-data </p>}
    </div>
  );
};

export default MetaData;

const Data = ({ metaData }) => {
    return(<>
  <p>Video Duration : {metaData.duration.toFixed(2)} seconds</p>
  <p>Video Width : {metaData.videoWidth}</p>
  <p>Video Height : {metaData.videoHeight}</p>
    </>)
};
