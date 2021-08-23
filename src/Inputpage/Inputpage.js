import React from "react";
import RecommendationPanel from "../recommendation-panel";
import {createInputSpec} from "./inputspec";
import "./Inputpage.css";
import {
  inputFileFormats,
  // colorScheme,
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
import { debounce } from "lodash";
import stimuli from "../assets/evaluationstimuli/stimuli.json";
import ScoringCardUI from "../Inputpage/scoringcard";

var genorecEngine = require("genorec-engine");


class Inputpage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      minFiles: 0,
      maxFiles: 20,
      totalFiles: 0,
      dataCardsinRow: 4,
      inputFileFormats,
      inputConfigurationData: {},
      showTaskPanel: false,
      showRecommendation: false,
      recommendationButtonString:"Show Recommendation",
      recommendationNotPossible:true,
      taskList: taskList,
      selectedTaskOption:"",
      orderedDataDescriptionBoxes: [[], [], [], [], []],
      screenHeight: window.innerHeight,
      recommendationInputSpec:{},
      recommendationOutputSpec:[],
      recommendationPanelWidth:800,
      recommendationPanelWidthEval:800,
      showIdeogram:false,
      showGeneAnnotation:true,
      showRecommendationPanel: this.props.data,
      outputForEvaluation: [],
      currenEvalOption:1
    };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);
    this.onChangeFileDataUpdate = this.onChangeFileDataUpdate.bind(this);
    this.reAlignTheIndexes = this.reAlignTheIndexes.bind(this);
    this.toggleTaskCardSelection = this.toggleTaskCardSelection.bind(this);
    this.getRecommendationOutput = this.getRecommendationOutput.bind(this);
    this.handleRecommendationClick = this.handleRecommendationClick.bind(this);
    this.toggleGeneAnnotation = this.toggleGeneAnnotation.bind(this);
    this.toggleIdeoGram = this.toggleIdeoGram.bind(this);
    this.handleShowRecommendationForEvaluation = this.handleShowRecommendationForEvaluation.bind(this);
    this.optionUpdateHandle = this.optionUpdateHandle.bind(this);
    this.dataFileTypesAdded = [];
    this.dataDescriptionBoxes = [];
    this.finalRecommendationOutputSpec = [];
    
  
    // !! TODO: set default input data and task descriptions
    // this.onChangeFileQuantity({ target: { name: 'bigwig', value: '1' } });
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
        let lengthOfAddedDatasets = Object.keys(currentDataConfigurationInput)
          .length;
        let orderedDataIndex = Math.floor(
          lengthOfAddedDatasets / this.state.dataCardsinRow
        );

        this.dataFileTypesAdded.push(updatedFileType);
        let fileid = "" + updatedFileType + index;
        currentDataConfigurationInput[fileid] = JSON.parse(JSON.stringify(defaultInputForFiles[updatedFileType]));
        this.dataDescriptionBoxes.push(
          this.dataDescriptionBox(updatedFileType, fileid, index)
        );

        this.state.orderedDataDescriptionBoxes[orderedDataIndex].push(
          this.dataDescriptionBox(updatedFileType, fileid, index)
        );
      }
    } 
    else {
      for (let index = currentCount; index > updatedCount; index--) {
        let removeIndex = Math.max(
          ...this.getAllIndexes(this.dataFileTypesAdded, updatedFileType)
        );
        let fileid = "" + updatedFileType + index;
        delete currentDataConfigurationInput[fileid];
        this.dataFileTypesAdded.splice(removeIndex, 1);

        // document.querySelector("#" + fileid).style.display = "none";

        var elem = document.querySelector("#" + fileid);
        try{        
          elem.remove();
        }
        catch(error){
          console.log(elem);
          console.error(error);
        }
        // this.dataDescriptionBoxes.splice(removeIndex, 1);

        this.reAlignTheIndexes();
      }
    }

    inputFileFormats[event.target.name] = event.target.value;

    let showTaskPanel = this.dataFileTypesAdded.length > 0 ? true:false;
    let recommendationNotPossible = this.dataFileTypesAdded.length > 0 ? false:true;

    let recommendationOutput = this.getRecommendationOutput(currentDataConfigurationInput,this.state.taskList,this.countTotalFiles(inputFileFormats),this.state.selectedTaskOption,this.state.showGeneAnnotation, this.state.showIdeogram);

    this.setState({
      inputFileFormats: inputFileFormats,
      inputConfigurationData: currentDataConfigurationInput,
      showTaskPanel: showTaskPanel,
      recommendationNotPossible,
      recommendationInputSpec:recommendationOutput.recommendationInputSpec,
      recommendationOutputSpec:recommendationOutput.recommendationOutputSpec,
    }, ()=> console.log(this.state));
  }

  reAlignTheIndexes() {
    let tempDescriptionBoxes = [];
    this.state.orderedDataDescriptionBoxes.forEach(() => {
      tempDescriptionBoxes.push([]);
    });

    for (let i = 0; i < this.dataDescriptionBoxes.length; i++) {
      let rowIndex = Math.floor(i / this.state.dataCardsinRow);
      tempDescriptionBoxes[rowIndex].push(this.dataDescriptionBoxes[i]);
    }
    this.setState({
      orderedDataDescriptionBoxes: tempDescriptionBoxes,
    });
  }

  onChangeFileDataUpdate(fileid, componentid, value, addtionalInput) {
    let configurationData = this.state.inputConfigurationData;
    console.log(fileid, componentid, value);
    if (componentid === "data") {
      configurationData[fileid][componentid][addtionalInput] = parseInt(value);
    } else {
      configurationData[fileid][componentid] = value;
    }    

    let recommendationOutput = this.getRecommendationOutput(configurationData,this.state.taskList,this.countTotalFiles(this.state.inputFileFormats),this.state.selectedTaskOption,this.state.showGeneAnnotation,this.state.showIdeogram);

    this.setState({
      inputConfigurationData: configurationData,
      recommendationInputSpec:recommendationOutput.recommendationInputSpec,
      recommendationOutputSpec:recommendationOutput.recommendationOutputSpec,
      recommendationNotPossible:false
    }, ()=> console.log(this.state));
  }

  getRecommendationOutput(input,taskList,fileCount,selectedTask,geneAnnotation, ideogramDisplayed)
  {
    let recommendationInputSpec = {};
    let recommendationOutputSpec = [];
    let currentRecommendationOutput = this.state.recommendationOutputSpec;
        
    //Total File Count
    if(fileCount>0)
    {
      recommendationInputSpec = createInputSpec(JSON.stringify(input),taskList, selectedTask , geneAnnotation, ideogramDisplayed);
      recommendationOutputSpec = genorecEngine.getRecommendation(recommendationInputSpec);
      if(currentRecommendationOutput["tasks"] === undefined) recommendationOutputSpec["tasks"] = ["overview"];
      else recommendationOutputSpec["tasks"] = currentRecommendationOutput["tasks"].length === 0 ? ["overview"] : currentRecommendationOutput["tasks"];
    }

    return {recommendationInputSpec,recommendationOutputSpec};
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
    // let fileTypeColor = colorScheme[fileType];
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
          className="w3-left w3-border-bottom w3-margin-bottom datadescriptioncard"
        >
          {/* <div className={"w3-container w3-margin w3-center " + fileTypeColor}> */}
          <div className={"w3-container w3-margin w3-center w3-khaki"}>
            <h5>
              {fileTypeToCaps} {id}
            </h5>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div className="w3-col s12 w3-center">
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
            <div className="w3-col s12  w3-center">
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
          {/* Interconnection Radio Input */}
          <div className={"w3-margin w3-row " + interconnection}>
            {createNetworkInput(
              defaultValues["interconnection"],
              fileid,
              "interconnection",
              this.onChangeFileDataUpdate
            )}
          </div>
        </div>
        <span></span>
      </>
    );
  }

  toggleTaskCardSelection(event)
  {
    
    // let targetId = event.target.id;
    let taskLists = this.state.taskList;
    let stateTaskVal = this.state.selectedTaskOption;
    let inputTaskVal = event.target.value;

    if(inputTaskVal === stateTaskVal) stateTaskVal = "";
    else stateTaskVal = inputTaskVal;

    taskLists.map(val =>{
      if(stateTaskVal === val["task"]){
        val["selected"] = true;
      }
      else val["selected"] = false;
    });

    let selectedTaskFullSpec = taskLists.filter(val => val["selected"]);
    let activeTasks = selectedTaskFullSpec.map(val => val["task"]);
    let recommendationOutputSpec = this.state.recommendationOutputSpec;
    if(activeTasks.length>0) recommendationOutputSpec["tasks"] = activeTasks;
    else recommendationOutputSpec["tasks"] = ["overview"];

    let recommendationOutput = this.getRecommendationOutput(this.state.inputConfigurationData,this.state.taskList,this.countTotalFiles(this.state.inputFileFormats),stateTaskVal,this.state.showGeneAnnotation, this.state.showIdeogram);


    this.setState({
      taskList:taskLists,
      selectedTaskOption: stateTaskVal,
      recommendationInputSpec:recommendationOutput.recommendationInputSpec,
      recommendationOutputSpec:recommendationOutput.recommendationOutputSpec,
      recommendationNotPossible:false
    }, ()=> console.log(this.state));
  }

  createTaskCards(val) {
    let classNameVar = val["disabled"] ? "w3-opacity-max" : "";
    let selectedClass = val["selected"] ? "selected": "";
    return (
      <>
        <div
          className={`w3-display-container w3-margin-top w3-light-grey w3-row w3-center ${classNameVar} ${selectedClass}`}
          // id={val["task"]}
          // onClick = {this.toggleTaskCardSelection}
        >
          <div className="w3-quarter w3-margin-top w3-margin-bottom">  
            <label>
              <input
                type="checkbox"
                value= {val["task"]}
                id={val["task"]}
                className="w3-check"
                checked={this.state.selectedTaskOption === val["task"]}
                onChange={this.toggleTaskCardSelection}
              />
            </label>    
            <h5> {val["taskLabel"]}</h5>     
          </div>
          <div className="w3-quarter w3-margin-top">
            <img
              id={val["task"]}
              className="taskimg"
              src={require("../assets/" + val["image"])}
              alt={val["task"]}
            /> 
          </div>
          <div className="w3-half w3-margin-top w3-margin-bottom">  <p> {val["taskInfo"]}</p> </div>
        </div>
      </>
    );
  }

  createHTMLLayoutTasks(input)
  {
    let allCards = [];

    input.forEach(val =>{
      allCards.push(this.createTaskCards(val));
    });
    return allCards;
  }

  handleRecommendationClick()
  {
    this.finalRecommendationOutputSpec =  JSON.parse(JSON.stringify(this.state.recommendationOutputSpec));
    this.setState({
      showRecommendation:true,
      recommendationNotPossible:true    
    }, ()=> console.log(this.state));
  }

  toggleGeneAnnotation()
  {
    let updatedGeneAnnotation = !this.state.showGeneAnnotation;
    let recommendationOutput = this.getRecommendationOutput(this.state.inputConfigurationData,this.state.taskList,this.countTotalFiles(this.state.inputFileFormats),this.state.selectedTaskOption,updatedGeneAnnotation, this.state.showIdeogram);

    this.setState({
      showGeneAnnotation: updatedGeneAnnotation,
      recommendationInputSpec:recommendationOutput.recommendationInputSpec,
      recommendationOutputSpec:recommendationOutput.recommendationOutputSpec,
      recommendationNotPossible:false
    },() => { 
      console.log(this.state);});
  }

  toggleIdeoGram()
  {
    let updatedIdeogram = !this.state.showIdeogram;
    let recommendationOutput = this.getRecommendationOutput(this.state.inputConfigurationData,this.state.taskList,this.countTotalFiles(this.state.inputFileFormats),this.state.selectedTaskOption,this.state.showGeneAnnotation, updatedIdeogram);

    this.setState({
      showIdeogram: updatedIdeogram,
      recommendationInputSpec:recommendationOutput.recommendationInputSpec,
      recommendationOutputSpec:recommendationOutput.recommendationOutputSpec,
      recommendationNotPossible:false
    },()=> console.log(this.state));
  }

  componentDidMount() {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)

    // Upon resizing, use new width for the recommendation panel
    window.addEventListener(
      "resize",
      debounce(() => {
        this.setState({
          recommendationPanelWidth: document.getElementsByClassName("recommendationOutputPanel")[0].offsetWidth,
          recommendationPanelWidthEval: document.getElementsByClassName("recommendationOutputPanelEval")[0].offsetWidth
        });
      }, 1000)
    );

    this.setState({
      recommendationPanelWidth: document.getElementsByClassName("recommendationOutputPanel")[0].offsetWidth,
      recommendationPanelWidthEval: document.getElementsByClassName("recommendationOutputPanelEval")[0].offsetWidth
    }, ()=> console.log(this.state) );
  }

  //Handle Evaluation Click
  handleShowRecommendationForEvaluation()
  {
    let updatedRecommendation = [stimuli.stimuliList[0].recommendationSpec[0]];
    this.setState({
      outputForEvaluation: updatedRecommendation,
      recommendationNotPossible:true,
      showRecommendation:true
    });
  }

  optionUpdateHandle()
  {
    var ele = document.getElementsByName("score");
              
    for(let i = 0; i < ele.length; i++) {
      if(ele[i].checked)
      {
        let updatedRecommendation = [stimuli.stimuliList[0].recommendationSpec[1]];
        if(this.state.currenEvalOption===1)
        {
          this.setState({
            outputForEvaluation: updatedRecommendation,
            currenEvalOption:2
          });
        }
        else{
          this.props.enableNextTask();
        }
        return;
      }
    }

    alert("Please select a score before submitting and moving on.");

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
            <div className="w3-row w3-center">
              <div className="w3-half">
                <div className="w3-row">
                  <div className="w3-center w3-padding">
                    <h3>
                      {" "}
                      <i className="fa fa-table w3-margin-right"></i> Data
                      Description{" "}
                      {/* <i className="fa fa-info-circle w3-margin-right"></i> */}
                    </h3>
                  </div>
                </div>

                <div className="w3-row">
                  <div className="w3-display-container w3-margin">
                    <div className="w3-center w3-light-gray  w3-col">
                      <div className="w3-container  w3-light-blue">
                        <h5>Dataset Formats</h5>
                      </div>
                      <div className="w3-row-padding">{fileFormatDivs}</div>
                    </div>
                  </div>
                </div>

                <div className="w3-row datadescription">
                  {
                    this.dataDescriptionBoxes
                  }
                  {/* {this.state.orderedDataDescriptionBoxes.map((val, index) => {
                    return <div className="w3-row">{val}</div>;
                  })} */}
                </div>

                <div
                  className="taskcards"
                  style={{ display: this.state.showTaskPanel ? "" : "none" }}
                >
                  <div className="w3-row w3-margin-top">
                    <div className="w3-center  w3-padding">
                      <h3>
                        {" "}
                        <i className="fa fa-tasks w3-margin-right"></i> Task
                        Description{" "}
                        {/* <i className="fa fa-info-circle w3-margin-right"></i> */}
                      </h3>
                    </div>
                  </div>

                  <div className="w3-row">{taskCards}</div>
                </div>
              </div>

              {/* App Recommendation Output */}
              <div style={{display: this.state.showRecommendationPanel ==="App-Mode" ? "" : "none"}}  className="w3-half">
                <div className="w3-row">
                  <div className="w3-row w3-display-container">
                    <div className="w3-center w3-padding">
                      <h3>
                        <i className="fa fa-th-list w3-margin-right"></i>{" "}
                        Recommendation{" "}
                      </h3>
                      <div className="w3-containter">
                        <div className="w3-row">
                          <button className="notification w3-button w3-indigo" onClick={this.handleRecommendationClick} disabled={this.state.recommendationNotPossible}>
                            {this.state.recommendationButtonString} {" "}
                          </button>
                        </div>
                        <div className="w3-row">
                          <div className="w3-half">
                            <input  checked={this.state.showIdeogram}  onChange={this.toggleIdeoGram} className="w3-check"  type="checkbox" ></input>
                            <label className="w3-margin"> Show Ideogram </label> 
                          </div>
                          <div className="w3-half">
                            <input checked={this.state.showGeneAnnotation} onChange={this.toggleGeneAnnotation} className="w3-check" type="checkbox"  ></input>
                            <label className="w3-margin"> Show Gene Annotation </label> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="recommendationOutputPanel" className="w3-row w3-center w3-display-container w3-margin recommendationOutputPanel">
                    <RecommendationPanel 
                      className="w3-center" 
                      data={this.finalRecommendationOutputSpec} 
                      width={this.state.recommendationPanelWidth} 
                      _data={this.state.recommendationOutputSpec}
                    />
                  </div>
                </div>
              </div>
              {/* Evaluation Recommendation Output */}
              <div style={{display: this.state.showRecommendationPanel ==="Eval-Mode" ? "" : "none"}}  className="w3-half">
                <div className="w3-row">
                  <div className="w3-row w3-display-container">
                    <div className="w3-center w3-padding">
                      <h3>
                        <i className="fa fa-th-list w3-margin-right"></i>{" "}
                        Recommendation{" "}
                      </h3>
                      <div className="w3-containter">
                        <div className="w3-row">
                          <button className="notification w3-button w3-indigo" onClick={this.handleShowRecommendationForEvaluation} disabled={this.state.recommendationNotPossible}>
                            {this.state.recommendationButtonString} {" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="recommendationOutputPanelEval" className="w3-row w3-center w3-display-container w3-margin recommendationOutputPanelEval">
                    <RecommendationPanel 
                      className="w3-center" 
                      data={this.state.outputForEvaluation} 
                      width={this.state.recommendationPanelWidthEval} 
                      _data={this.state.outputForEvaluation}
                    />
                    <ScoringCardUI key={this.state.currenEvalOption} id={this.state.currenEvalOption}  display={this.state.showRecommendation} handler={this.optionUpdateHandle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Inputpage;
