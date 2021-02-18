import React from "react";
import "./Inputpage.css";
import {
  inputFileFormats,
  colorScheme,
  fileInputFieldsActive,
  defaultInputForFiles
} from "../global/globalvar";
import {
  createDropDownList,
  createNetworkInput,
  createGranularityInput,
  createAvailablityInput,
  createDataTypeInput,
} from "./createdomcomponents";

class Inputpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minFiles: 0,
      maxFiles: 5,
      totalFiles: 0,
      inputFileFormats,
      showRecommendButton: false,
    };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);
    this.dataFileTypesAdded = [];
    this.dataDescriptionBoxes =[]
  }

  //Utility Functions
  countTotalFiles(inputFileFormats) {
    return Object.keys(inputFileFormats).reduce(
      (sum, key) => sum + parseFloat(inputFileFormats[key] || 0),
      0
    );
  }

  getAllIndexes(arr, val) {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  }
  //Utility Functions end

  onChangeFileQuantity(event) {
    //Changed type and counts
    let updatedFileType = event.target.name;
    let updatedCount = event.target.value;

    //existing counts
    let inputFileFormats = { ...this.state.inputFileFormats };

    //Identify the current count for updated file
    let currentCount = inputFileFormats[updatedFileType];

    //Add or Remove Data Input Files
    if (currentCount < updatedCount) {
      for(var index = parseInt(currentCount)+1; index<=updatedCount; index++){
        this.dataFileTypesAdded.push(updatedFileType);
        let fileid = ""+updatedFileType+index
        this.dataDescriptionBoxes.push(this.dataDescriptionBox(updatedFileType,fileid,index));
      }
    } 
    else {
     for(let index = currentCount; index>updatedCount; index--){
      let removeIndex = Math.max(...this.getAllIndexes(this.dataFileTypesAdded,updatedFileType));
      this.dataFileTypesAdded.splice(removeIndex,1)
      this.dataDescriptionBoxes.splice(removeIndex,1);
    }
    }

    inputFileFormats[event.target.name] = event.target.value;
    let localTotalFiles = this.countTotalFiles(inputFileFormats);
    let showRecommendButton = false;
    if (localTotalFiles > 0) {
      showRecommendButton = true;
    }

    this.setState({
      inputFileFormats: inputFileFormats,
      showRecommendButton: showRecommendButton,
    });
  }



  createDivForFileInput(name) {
    let fileTypeColor = colorScheme[name];
    return (
      <>
        <div className={"w3-margin-top w3-margin-bottom"}>
          <label>
            {" "}
            <span className={"dot " + fileTypeColor}></span>{" "}
            {name.toUpperCase()}
          </label>
          <input
            className="w3-input w3-border w3-center"
            onChange={this.onChangeFileQuantity}
            type="number"
            name={name}
            value={this.state.inputFileFormats[name]}
            min={this.state.minFiles}
            max={this.state.maxFiles}
          />
        </div>
      </>
    );
  }

  dataDescriptionBox(fileType,fileid,id) {
    let fileTypeToCaps = fileType.toUpperCase();
    let fileTypeColor = colorScheme[fileType];
    let activeFields = fileInputFieldsActive[fileType];
    let assembly1 = false;
    let assembly2 = !activeFields["assembly2"];
    let interconnection = !activeFields["interconnection"]
      ? "w3-opacity-max"
      : "";
    let granularity = !activeFields["granularity"] ? "w3-opacity-max" : "";
    let availability = !activeFields["availability"] ? "w3-opacity-max" : "";
    let dataTypeInput = !activeFields["data"];
    let dataTypeInputOpacity = !activeFields["data"] ? "w3-opacity-max" : "";

    let defaultValues = defaultInputForFiles[fileType]

    return (
      <>
        <div id={fileid} className="w3-third w3-border-bottom ">
          <div className={"w3-container w3-margin w3-center " + fileTypeColor}>
            <h4>{fileTypeToCaps} {id}</h4>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              {createDropDownList(assembly1,fileid,defaultValues["assembly1"])}
            </div>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              {createDropDownList(assembly2,fileid,defaultValues["assembly1"])}
            </div>
          </div>
          {/* Interconnection Radio Input */}
          <div className={"w3-margin w3-row " + interconnection}>
            {createNetworkInput(defaultValues["interconnection"])}
          </div>
          {/* Feature Input */}
          <div className={"w3-margin w3-row " + granularity}>
            {createGranularityInput(defaultValues["granularity"])}
          </div>
          <div className={"w3-margin w3-row " + availability}>
            {createAvailablityInput(defaultValues["availability"])}
          </div>
          {/* Define the attributes */}
          <div className={"w3-margin w3-row " + dataTypeInputOpacity}>
            {createDataTypeInput(dataTypeInput,defaultValues["data"])}
          </div>
        </div>
      </>
    );
  }

  render() {
    const fileFormatDivs = [];

    for (let value of Object.keys(this.state.inputFileFormats)) {
      fileFormatDivs.push(this.createDivForFileInput(value));
    }

    return (
      <>
        <div className="w3-row">
          <div className="w3-display-container w3-content w3-margin w3-col l2">
            <div className="w3-center w3-margin-bottom w3-margin-top w3-light-gray w3-padding w3-col">
              <div className="w3-container  w3-light-blue">
                <h2>
                  <i className="fa fa-table w3-margin-right"></i> Add Dataset
                </h2>
              </div>
              <div className="w3-row-padding">{fileFormatDivs}</div>
              <button
                style={{
                  display: this.state.showRecommendButton ? "" : "none",
                }}
                onClick={this.describeData}
                className="w3-button w3-deep-purple"
              >
                {" "}
                Recommendation
              </button>
            </div>
          </div>

          <div className="w3-display-container w3-margin w3-col l6">
            <div className="w3-padding-16">
              {this.dataDescriptionBoxes}
              {/* {this.createDataDescriptionBoxes()} */}
            </div>
          </div>

          <div className="w3-display-container  w3-margin w3-col l3">
            <div className="w3-center w3-sand w3-margin w3-padding w3-col">
              <h2>
                <i className="fa fa-th-list"></i> Recommendation
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Inputpage;
