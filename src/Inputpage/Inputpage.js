import React from "react";
import "./Inputpage.css";
import {
  inputFileFormats,
  colorScheme,
  fileInputFieldsActive,
  defaultInputForFiles,
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
      inputData: {},
      showRecommendButton: false,
    };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);
    this.dataFileTypesAdded = [];
    this.dataDescriptionBoxes = [];
    this.dataInput = {};
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

  //Adding Dataset
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
      for (
        var index = parseInt(currentCount) + 1;
        index <= updatedCount;
        index++
      ) 
      {
        this.dataFileTypesAdded.push(updatedFileType);
        let fileid = "" + updatedFileType + index;
        this.dataDescriptionBoxes.push(
          this.dataDescriptionBox(updatedFileType, fileid, index)
        );
      }
    } else {
      for (let index = currentCount; index > updatedCount; index--) {
        let removeIndex = Math.max(
          ...this.getAllIndexes(this.dataFileTypesAdded, updatedFileType)
        );
        this.dataFileTypesAdded.splice(removeIndex, 1);
        this.dataDescriptionBoxes.splice(removeIndex, 1);
      }
    }

    inputFileFormats[event.target.name] = event.target.value;

    //Show recommendation logic goes here
    // let localTotalFiles = this.countTotalFiles(inputFileFormats);
    // let showRecommendButton = false;
    // if (localTotalFiles > 0) {
    //   showRecommendButton = true;
    // }

    this.setState({
      inputFileFormats: inputFileFormats,
    });
  }
  //Finished adding dataset

  // Handling change requests from datasets

  //Finished handling dataset


  createDivForFileInput(name) {
    // let fileTypeColor = colorScheme[name];
    return (
      <>
        <div className={"w3-col l2 w3-margin-top w3-margin-bottom"}>
          <label>
            {" "}
            {/* <span className={"dot " + fileTypeColor}></span>{" "} */}
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

  dataDescriptionBox(fileType, fileid, id) {
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

    let defaultValues = defaultInputForFiles[fileType];

    return (
      <>
        <div
          id={fileid}
          className="w3-quarter w3-left w3-border-bottom w3-margin-bottom"
        >
          {/* <div className={"w3-container w3-margin w3-center " + fileTypeColor}> */}
          <div className={"w3-container w3-margin w3-center w3-khaki"}>
            <h5>
              {fileTypeToCaps} {id}
            </h5>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12 w3-center">
              {createDropDownList(
                assembly1,
                fileid,
                defaultValues["assembly1"]
              )}
            </div>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              {createDropDownList(
                assembly2,
                fileid,
                defaultValues["assembly2"]
              )}
            </div>
          </div>
          {/* Define the attributes */}
          <div className={"w3-margin w3-row " + dataTypeInputOpacity}>
            {createDataTypeInput(dataTypeInput, defaultValues["data"])}
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
          <div className="w3-display-container w3-padding w3-margin">
            <div className="w3-row w3-center w3-margin">
              <div className="w3-half">
                
                <div className="w3-row">
                <div className="w3-center w3-blue-grey w3-padding">
                  <h3> <i className="fa fa-table w3-margin-right"></i> Data Description</h3>
                </div>
                </div>

                <div class="w3-row">
                <div className="w3-display-container w3-margin">
                <div className="w3-center w3-light-gray  w3-col">
                  <div className="w3-container  w3-light-blue">
                        <h5>
                           Add
                          Dataset
                        </h5>
                      </div>
                      <div className="w3-row-padding">{fileFormatDivs}</div>
                  </div>
                  </div>
                </div>

                <div class="w3-row">{this.dataDescriptionBoxes}</div>

              </div>
              <div className="w3-half">

                <div className="w3-row">
                <div className="w3-center w3-light-grey w3-padding">
                <h3> <i className="fa fa-tasks w3-margin-right"></i> Task Description</h3>
            </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="w3-row">
          <div className="w3-display-container w3-padding w3-margin ">
            <div className="w3-center w3-sand w3-margin w3-padding">
              <h3>
                <i className="fa fa-th-list w3-margin-right"></i> Recommendation
              </h3>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Inputpage;
