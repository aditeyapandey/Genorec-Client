import React from "react";

export const createDropDownList = (disabledVal, fileid, defaultValue, componentid ,onChangeAssemblyBuild) => {
  let buildNames;
  if (!disabledVal) {
    buildNames = ["hg38", "hg19", "hg17", "hg16", "mm10", "mm9"];
  } else {
    buildNames = ["N.A."];
  }

  let handleChangeEvent =  function(event) {
    onChangeAssemblyBuild(fileid,componentid,event.target.value)
  }

  return (
    <>
      <select
        className="w3-select"
        disabled={disabledVal}
        name={fileid}
        id={fileid+componentid}
        onChange={handleChangeEvent}
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

export const createNetworkInput = (defaultValue,fileid,componentid,onChangeFileDataUpdate) => {
  let noNetworkSelected = ""
  let networkSelected = ""
  if (defaultValue) {
    networkSelected = "selected"
  } else {
    noNetworkSelected = "selected"
  }

  let handleOnClick = function(event){
    if(event.target.name === "nonetwork"){
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"network"
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    else{
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"nonetwork"
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    let updatedValue = event.target.name === "nonetwork"? false:true
    onChangeFileDataUpdate(fileid,componentid,updatedValue)
  }
  return (
    <>
      <div className={"w3-center w3-margin-top w3-hover-opacity w3-third"}>
        <p> Connection  </p>
      </div>
      <div className={"w3-center w3-hover-opacity w3-third"}>
        <img
          src={require("../assets/interconnection_none.png")}
          className={"w3-round "+noNetworkSelected}
          name="nonetwork"
          id={fileid+componentid+"nonetwork"}
          alt="no network"
          onClick={handleOnClick}
        />
        <p> No </p>
      </div>
      <div className="w3-center w3-third">
        <img
          src={require("../assets/interconnection_between.png")}
          className={"w3-round "+networkSelected}
          name="network"
          id={fileid+componentid+"network"}
          onClick={handleOnClick}
          alt="network"
        />
        <p> Yes </p>
      </div>
    </>
  );
};

export const createGranularityInput = (granularity,fileid,componentid,onChangeFileDataUpdate) => {
  let pointSelected = {};
  let segmentSelected = {};
  if (granularity === "Point") {
    pointSelected="selected"
  } else {
    segmentSelected="selected"
  } 

  let handleOnClick = function(event){
    if(event.target.name === "Point"){
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"Segment"
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    else{
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"Point"
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    let updatedValue = event.target.name === "Point"? "Point":"Segment"
    onChangeFileDataUpdate(fileid,componentid,updatedValue)

  }  

  return (
    <>
      <div className={"w3-center w3-margin-top w3-hover-opacity w3-third"}>
        <p> Feature Extent </p>
        {/* <p> Granularity </p> */}
      </div>
      <div  className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/pointsparse.png")}
          className={"w3-round "+pointSelected}
          id={fileid+componentid+"Point"}
          alt="point"
          onClick={handleOnClick}
          name="Point"
        ></img>
        <p> Point </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/segmentcontiguous.png")}
          className={"w3-round "+segmentSelected}
          id={fileid+componentid+"Segment"}
          alt="segment"
          onClick={handleOnClick}
          name="Segment"
        />
        <p> Segment </p>
      </div>
    </>
  );
};

export const createAvailablityInput = (availability,fileid,componentid,onChangeFileDataUpdate) => {
  let continousSelected = "";
  let sparseSelected = "";
  if (availability === "Sparse") {
    sparseSelected = "selected";
  } else {
    continousSelected = "selected";
  }

  let handleOnClick = function(event){
    if(event.target.name === "Sparse"){
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"Continous"
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    else{
      let partialid = fileid+componentid
      let selectedid = partialid+event.target.name
      let unselectedid = partialid+"Sparse"
      console.log(unselectedid)
      document.getElementById(selectedid).setAttribute("class","w3-round selected")
      document.getElementById(unselectedid).setAttribute("class","w3-round")
    }
    let updatedValue = event.target.name === "Sparse"? "Sparse":"Continous"
    onChangeFileDataUpdate(fileid,componentid,updatedValue)

  }  
  return (
    <>
      <div className={"w3-center w3-margin-top w3-hover-opacity w3-third"}>
        <p> Feature Density</p>
      </div>
      <div  className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/segmentsparse.png")}
          className={"w3-round "+sparseSelected}
          alt="sparse"
          id={fileid+componentid+"Sparse"}
          name="Sparse"
          onClick={handleOnClick}
        />
        <p> Sparse </p>
      </div>
      <div className="w3-center w3-hover-opacity w3-third">
        <img
          src={require("../assets/pointcontiguous.png")}
          className={"w3-round "+continousSelected}
          alt="continous"
          name="Continous"
          id={fileid+componentid+"Continous"}
          onClick={handleOnClick}
        />
        <p> Contiguous </p>
      </div>
    </>
  );
};

export const createDataTypeInput = (dataTypeInput,fileid,componentid,onChangeAssemblyBuild) => {
  
  let handleChangeEvent = function(event) {
    onChangeAssemblyBuild(fileid,componentid,event.target.value,event.target.name)
  }
  let quantVals=[1,0,2,3,4,5]
  let textorcatVals=[0,1,2,3,4,5]

  return (
    <>
      <div className="w3-center w3-third">
        {/* <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          name="dummy"
          onChange = {handleChangeEvent} 
          value = {"1"}
        /> */}
        <select
          className="w3-center w3-padding w3-select"
          disabled={dataTypeInput}
          name={"quant"}
          id={fileid+componentid+"quant"}
          onChange={handleChangeEvent}
        >
          {quantVals.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <p>Quant</p>

      </div>
      <div className="w3-center  w3-third">
        {/* <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          value={defaultValue["cat"]}
        /> */}
        <select
          className="w3-center w3-padding w3-select"
          disabled={dataTypeInput}
          name={"cat"}
          id={fileid+componentid+"cat"}
          onChange={handleChangeEvent}
        >
          {textorcatVals.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        
        <p>Categorical</p>
      </div>
      <div className="w3-center w3-third">
        {/* <input
          disabled={dataTypeInput}
          className=" w3-input w3-border w3-center"
          type="number"
          value={defaultValue["text"]}
        /> */}
        <select
          className="w3-center w3-padding w3-select"
          disabled={dataTypeInput}
          name={"text"}
          id={fileid+componentid+"text"}
          onChange={handleChangeEvent}
        >
          {textorcatVals.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <p>Text</p>
      </div>
    </>
  );
};
