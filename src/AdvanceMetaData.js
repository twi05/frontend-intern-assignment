import React from 'react'
import "./style.css";
const AdvanceMetaData = ({ advMetaData }) => {
    return (
      <div className="adv-meta-data">
        <h2
          style={{
            textDecoration: "underline",
  
          }}
        >
          More Meta Data
        </h2>
        <pre>{advMetaData}</pre>;
      </div>
    );
  };
  

export default AdvanceMetaData