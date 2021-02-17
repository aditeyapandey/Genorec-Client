import React from "react";

export const createDropDownList = (disabledVal,fileid) => {
  let buildNames
  if(!disabledVal){
    buildNames = ["hg38","hg19","hg17","hg16","mm10","mm9"] 
  }  
  else{
    buildNames = ["N.A."]
  }
  return (
    <>
      <select className="w3-select" disabled={disabledVal} name={fileid} value={buildNames[0]}>
        {buildNames.map(val=> <option key={val} value={val}>Assembly Build: {val}</option> )}
      </select>
    </>
  );
};

export const createNetworkInput = () => {
  return (
    <>
      <div className={"w3-center w3-hover-opacity w3-half"}>
        <img
          src={require("../assets/interconnection_none.png")}
          class="w3-round"
          alt="point"
        />
        <p> No </p>
      </div>
      <div className="w3-center w3-half">
        <img
          src={require("../assets/interconnection_between.png")}
          class="w3-round"
          alt="segment"
        />
        <p> Yes </p>
      </div>
    </>
  );
};

export const createGranularityInput = () => {
  return (
    <>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/pointsparse.png")}
          class="w3-round"
          alt="point"
        />
        <p> Point </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/segmentcontiguous.png")}
          class="w3-round"
          alt="segment"
        />
        <p> Segment </p>
      </div>
    </>
  );
};

export const createAvailablityInput = () => {
  return (
    <>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/pointcontiguous.png")}
          class="w3-round"
          alt="segment"
        />
        <p> Contiguous </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-half">
        <img
          src={require("../assets/segmentsparse.png")}
          class="w3-round"
          alt="segment"
        />
        <p> Sparse </p>
      </div>
    </>
  );
};

export const createDataTypeInput = (dataTypeInput) => {
  return (
    <>
      <div className="w3-center w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
        />
        <p>Quant</p>
      </div>
      <div className="w3-center  w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
        />
        <p>Categorical</p>
      </div>
      <div className="w3-center w3-third">
        <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
        />
        <p>Text</p>
      </div>
    </>
  );
};
