import React from "react";
import "./Inputpage.css";
import {
  inputFileFormats,
  colorScheme,
  fileInputFieldsActive,
  defaultInputForFiles,
  taskList,
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
      maxFiles: 20,
      totalFiles: 0,
      dataCardsinRow: 4,
      inputFileFormats,
      inputConfigurationData: {},
      showRecommendButton: false,
      dataDescriptionBoxes: [],
      taskList: taskList,
      orderedDataDescriptionBoxes: [[], [], [], [], []],
    };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);
    this.onChangeFileDataUpdate = this.onChangeFileDataUpdate.bind(this);
    this.reAlignTheIndexes = this.reAlignTheIndexes.bind(this);
    this.dataFileTypesAdded = [];
    this.inputConfigurationData = {};
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
    let currentDataConfigurationInput = this.state.inputConfigurationData;

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
      ) {
      
        let lengthOfAddedDatasets = Object.keys(currentDataConfigurationInput).length;
        let orderedDataIndex = Math.floor(lengthOfAddedDatasets / this.state.dataCardsinRow);
       

        this.dataFileTypesAdded.push(updatedFileType);
        let fileid = "" + updatedFileType + index;
        currentDataConfigurationInput[fileid] = Object.assign(
          {},
          defaultInputForFiles[updatedFileType]
        );
        this.state.dataDescriptionBoxes.push(
          this.dataDescriptionBox(updatedFileType, fileid, index)
        );

        this.state.orderedDataDescriptionBoxes[orderedDataIndex].push(
          this.dataDescriptionBox(updatedFileType, fileid, index)
        );
      }
    } else {
      for (let index = currentCount; index > updatedCount; index--) {
        let removeIndex = Math.max(
          ...this.getAllIndexes(this.dataFileTypesAdded, updatedFileType)
        );
        let fileid = "" + updatedFileType + index;
        delete currentDataConfigurationInput[fileid];
        this.dataFileTypesAdded.splice(removeIndex, 1);
        this.state.dataDescriptionBoxes.splice(removeIndex, 1);

        console.log( this.dataFileTypesAdded)
        console.log( currentDataConfigurationInput)

        this.reAlignTheIndexes();
      }
    }

    inputFileFormats[event.target.name] = event.target.value;

    this.setState({
      inputFileFormats: inputFileFormats,
      inputConfigurationData: currentDataConfigurationInput,
    });
  }

  reAlignTheIndexes() {
    let tempDescriptionBoxes = []
    this.state.orderedDataDescriptionBoxes.forEach(()=>{
      tempDescriptionBoxes.push([])
    });

    for (let i = 0; i < this.state.dataDescriptionBoxes.length; i++) {
      let testIndex = Math.floor(i / this.state.dataCardsinRow);
      tempDescriptionBoxes[testIndex].push(this.state.dataDescriptionBoxes[i]);
    }
    this.setState({
      orderedDataDescriptionBoxes: tempDescriptionBoxes
    })
  }

  onChangeFileDataUpdate(fileid, componentid, value, addtionalInput) {
    let configurationData = this.state.inputConfigurationData;
    console.log(fileid, componentid, value);
    if (componentid === "data") {
      configurationData[fileid][componentid][addtionalInput] = parseInt(value);
    } else {
      configurationData[fileid][componentid] = value;
    }
    this.setState({
      inputConfigurationData: configurationData,
    });
    console.log(this.state.inputConfigurationData);
  }

  createDivForFileInput(name) {
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
      ? "w3-opacity-max disabledClick"
      : "";
    let granularity = !activeFields["granularity"]
      ? "w3-opacity-max disabledClick"
      : "";
    let availability = !activeFields["availability"]
      ? "w3-opacity-max disabledClick"
      : "";
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
                defaultValues["assembly1"],
                "assembly1",
                this.onChangeFileDataUpdate
              )}
            </div>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              {createDropDownList(
                assembly2,
                fileid,
                defaultValues["assembly2"],
                "assembly2",
                this.onChangeFileDataUpdate
              )}
            </div>
          </div>
          {/* Define the attributes */}
          <div className={"w3-margin w3-row " + dataTypeInputOpacity}>
            {createDataTypeInput(
              dataTypeInput,
              fileid,
              "data",
              this.onChangeFileDataUpdate
            )}
          </div>
          {/* Interconnection Radio Input */}
          <div className={"w3-margin w3-row " + interconnection}>
            {createNetworkInput(
              defaultValues["interconnection"],
              fileid,
              "interconnection",
              this.onChangeFileDataUpdate
            )}
          </div>
          {/* Feature Input */}
          <div className={"w3-margin w3-row " + granularity}>
            {createGranularityInput(
              defaultValues["granularity"],
              fileid,
              "granularity",
              this.onChangeFileDataUpdate
            )}
          </div>
          <div className={"w3-margin w3-row " + availability}>
            {createAvailablityInput(
              defaultValues["availability"],
              fileid,
              "availability",
              this.onChangeFileDataUpdate
            )}
          </div>
        </div>
      </>
    );
  }

  createTaskCards(val) {
    return (
      <>
        <div className="w3-display-container w3-margin-top w3-third w3-center">
          <img
            id={val["task"]}
            className="taskimg"
            src={require("../assets/" + val["image"])}
            alt = {val["task"]}
          />
          <h5> {val["taskLabel"]}</h5>
          <p> {val["taskInfo"]}</p>
        </div>
      </>
    );
  }

  createHTMLLayoutTasks(input) {
    let mainrows = [];
    let allCards = [];

    for (let index = 0; index < input.length; index++) {
      if (index % 3 === 0 && index != 0) {
        mainrows.push(
          React.createElement("div", { className: "w3-row" }, allCards)
        );
        allCards = [];
      }
      allCards.push(this.createTaskCards(input[index]));
    }
    if (allCards.length !== 0) {
      mainrows.push(
        React.createElement("div", { className: "w3-row" }, allCards)
      );
    }
    return mainrows;
  }

  render() {
    const fileFormatDivs = [];

    const taskCards = this.createHTMLLayoutTasks(this.state.taskList);

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
                  <div className="w3-center w3-border-right w3-light-grey w3-padding">
                    <h3>
                      {" "}
                      <i className="fa fa-table w3-margin-right"></i> Data
                      Description{" "}
                      <i className="fa fa-info-circle w3-margin-right"></i>
                    </h3>
                  </div>
                </div>

                <div class="w3-row">
                  <div className="w3-display-container w3-margin">
                    <div className="w3-center w3-light-gray  w3-col">
                      <div className="w3-container  w3-light-blue">
                        <h5>Dataset Formats</h5>
                      </div>
                      <div className="w3-row-padding">{fileFormatDivs}</div>
                    </div>
                  </div>
                </div>

                <div class="w3-row">
                  {/* {this.state.dataDescriptionBoxes} */}
                  {this.state.orderedDataDescriptionBoxes.map((val,index) =>{
                      return (
                        <div className="w3-row">
                        {val}
                      </div>
                      )
                  })}
                </div>
              </div>
              <div className="w3-half">
                <div className="w3-row">
                  <div className="w3-center w3-light-grey w3-padding">
                    <h3>
                      {" "}
                      <i className="fa fa-tasks w3-margin-right"></i> Task
                      Description{" "}
                      <i className="fa fa-info-circle w3-margin-right"></i>
                    </h3>
                  </div>
                </div>

                <div className="w3-row">{taskCards}</div>
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
