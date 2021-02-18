import React from "react";

export const createDropDownList = (disabledVal, fileid, defaultValue) => {
  let buildNames;
  if (!disabledVal) {
    buildNames = ["hg38", "hg19", "hg17", "hg16", "mm10", "mm9"];
  } else {
    buildNames = ["N.A."];
  }
  return (
    <>
      <select
        className="w3-select"
        disabled={disabledVal}
        name={fileid}
        value={defaultValue}
      >
        {buildNames.map((val) => (
          <option key={val} value={val}>
            Assembly Build: {val}
          </option>
        ))}
      </select>
    </>
  );
};

export const createNetworkInput = (defaultValue) => {
  let styleNoNetwork = {};
  let styleNetwork = {};
  if (defaultValue) {
    styleNetwork["border"] = "5px solid rgb(226, 74, 74)";
  } else {
    styleNoNetwork["border"] = "5px solid rgb(226, 74, 74)";
  }
  return (
    <>
      <div className={"w3-center w3-hover-opacity w3-half"}>
        <span className="w3-border">
          <img
            src={require("../assets/interconnection_none.png")}
            className="w3-round"
            style={styleNoNetwork}
            alt="point"
          />
        </span>
        <p> No </p>
      </div>
      <div className="w3-center w3-half">
        <img
          src={require("../assets/interconnection_between.png")}
          className="w3-round"
          alt="segment"
          style={styleNetwork}
        />
        <p> Yes </p>
      </div>
    </>
  );
};

export const createGranularityInput = (granularity) => {
    let pointStyle = {};
    let segmentStyle = {};
    console.log(granularity)
    if (granularity==="Segment") 
      {
        segmentStyle["border"] = "5px solid rgb(226, 74, 74)";
      } else 
      {
        pointStyle["border"] = "5px solid rgb(226, 74, 74)";
      }
  return (
    <>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/pointsparse.png")}
          class="w3-round"
          alt="point"
          style={pointStyle}
        />
        <p> Point </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/segmentcontiguous.png")}
          class="w3-round"
          alt="segment"
          style={segmentStyle}
        />
        <p> Segment </p>
      </div>
    </>
  );
};

export const createAvailablityInput = (availability) => {
    let continousStyle= {};
    let sparseStyle = {};
    if (availability==="Sparse") 
      {
        sparseStyle["border"] = "5px solid rgb(226, 74, 74)";
      } else 
      {
        continousStyle["border"] = "5px solid rgb(226, 74, 74)";
      }
  return (
    <>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/pointcontiguous.png")}
          class="w3-round"
          alt="segment"
          style={continousStyle}
        />
        <p> Contiguous </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/segmentsparse.png")}
          class="w3-round"
          alt="segment"
          style={sparseStyle}
        />
        <p> Sparse </p>
      </div>
    </>
  );
};

export const createDataTypeInput = (dataTypeInput,defaultValue) => {
  return (
    <>
      <div className="w3-center w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          value={defaultValue["quant"]}
        />
        <p>Quant</p>
      </div>
      <div className="w3-center  w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          value={defaultValue["cat"]}
        />
        <p>Categorical</p>
      </div>
      <div className="w3-center w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          value={defaultValue["text"]}
        />
        <p>Text</p>
      </div>
    </>
  );
};
