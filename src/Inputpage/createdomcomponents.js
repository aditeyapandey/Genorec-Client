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
  let noNetworkSelected = ""
  let networkSelected = ""
  if (defaultValue) {
    networkSelected = "selected"
  } else {
    noNetworkSelected = "selected"
  }
  return (
    <>
    <div className={"w3-center w3-hover-opacity w3-third"}>
        <p> Connection </p>
      </div>
      <div className={"w3-center w3-hover-opacity w3-third"}>
        <img
          src={require("../assets/interconnection_none.png")}
          className={"w3-round "+noNetworkSelected}
       
          alt="no network"
        />
        <p> No </p>
      </div>
      <div className="w3-center w3-third">
        <img
          src={require("../assets/interconnection_between.png")}
          className={"w3-round "+networkSelected}
          alt="network"

        />
        <p> Yes </p>
      </div>
    </>
  );
};

export const createGranularityInput = (granularity) => {
  let pointSelected = {};
  let segmentSelected = {};
  if (granularity === "Point") {
    pointSelected="selected"
  } else {
    segmentSelected="selected"
  } 

  return (
    <>
     <div className={"w3-center w3-hover-opacity w3-third"}>
        <p> Feature Type 1 </p>
        {/* <p> Granularity </p> */}
      </div>
      <div  className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/pointsparse.png")}
          className={"w3-round "+pointSelected}
          alt="point"
        ></img>

        <p> Point </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/segmentcontiguous.png")}
          className={"w3-round "+segmentSelected}
          alt="segment"
        />
        <p> Segment </p>
      </div>
    </>
  );
};

export const createAvailablityInput = (availability) => {
  let continousSelected = "";
  let sparseSelected = "";
  if (availability === "Sparse") {
    sparseSelected = "selected";
  } else {
    continousSelected = "selected";
  }
//   let continousStyle = {};
//   let sparseStyle = {};
//   if (availability === "Sparse") {
//     sparseStyle["border"] = "5px solid rgb(226, 74, 74)";
//   } else {
//     continousStyle["border"] = "5px solid rgb(226, 74, 74)";
//   } 
  return (
    <>
         <div className={"w3-center w3-hover-opacity w3-third"}>
        <p> Feature Type 2 </p>
      </div>
      <div  className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/segmentsparse.png")}
          className={"w3-round "+sparseSelected}
          alt="sparse"
        />
        <p> Sparse </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/pointcontiguous.png")}
          className={"w3-round "+continousSelected}
          alt="continous"
        />
        <p> Contiguous </p>
      </div>
    </>
  );
};

export const createDataTypeInput = (dataTypeInput, defaultValue) => {
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
