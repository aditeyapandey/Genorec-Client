import React from "react";
import "./Inputpage.css";
import { inputFileFormats,colorScheme,fileInputFieldsActive } from "../global/globalvar";

class Inputpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minFiles: 0, maxFiles: 5, totalFiles:0 ,inputFileFormats, showRecommendButton:false };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);
    // this.describeData = this.describeData.bind(this);
    this.createDataDescriptionBoxes = this.createDataDescriptionBoxes.bind(this)

  }

  countTotalFiles(inputFileFormats){
    return Object.keys(inputFileFormats).reduce((sum,key)=>sum+parseFloat(inputFileFormats[key]||0),0);
  }

  onChangeFileQuantity(event) {
    let inputFileFormats = { ...this.state.inputFileFormats };
    inputFileFormats[event.target.name] = event.target.value;
    let localTotalFiles = this.countTotalFiles(inputFileFormats)
    let showRecommendButton = false
    if(localTotalFiles>0){
      showRecommendButton = true
    }

    this.setState({
      inputFileFormats: inputFileFormats,
      showRecommendButton: showRecommendButton
    });
  }

  createDivForFileInput(name) {
    let fileTypeColor = colorScheme[name]
    return (
      <>
        <div className={"w3-margin-top w3-margin-bottom"}>
          <label>   <span className={"dot "+fileTypeColor}></span> {name.toUpperCase()}</label>
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

  dataDescriptionBox(fileType) {
    let fileTypeToCaps = fileType.toUpperCase()
    let fileTypeColor = colorScheme[fileType]
    let activeFields = fileInputFieldsActive[fileType]
    let interconnection = !activeFields["interconnection"] ? "w3-opacity-max":""
    let granularity = !activeFields["granularity"] ? "w3-opacity-max":""
    let availability = !activeFields["availability"] ? "w3-opacity-max":""
    return (
      <>
        <div className="w3-quarter w3-margin-bottom">
          <div className={"w3-container w3-margin w3-center " + fileTypeColor}>
            <h4>{fileTypeToCaps}</h4>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              <select className="w3-select" name="option">
                <option value="" disabled selected>
                  Assembly Build{" "}
                </option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </div>
          </div>
          {/* Assembly Build Dropdown 1 */}
          <div className="w3-margin w3-row">
            <div class="w3-col s12  w3-center">
              <select disabled={!activeFields["assembly2"]} className="w3-select" name="option">
                <option value="" disabled selected>
                  Assembly Build{" "}
                </option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </div>
          </div>
          {/* Interconnection Radio Input */}
          <div className={"w3-margin w3-row "+interconnection}>

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
          </div>
          {/* Feature Input */}
          <div className={"w3-margin w3-row "+granularity}>

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
          </div>

          <div className={"w3-margin w3-row "+availability}>
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
          </div>
          {/* Define the attributes */}
          <div className="w3-margin w3-row">
            <div className="w3-center  w3-hover-opacity w3-third">
              <input className=" w3-input w3-border w3-center" type="number" />
              <p>Quant</p>
            </div>
            <div className="w3-center  w3-hover-opacity w3-third">
              <input className=" w3-input w3-border w3-center" type="number" />
              <p>Categorical</p>
            </div>
            <div className="w3-center  w3-hover-opacity w3-third">
              <input className=" w3-input w3-border w3-center" type="number" />
              <p>Text</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  createDataDescriptionBoxes(){
    const dataDescriptionBoxes = []

    let fileTypes = Object.keys(this.state.inputFileFormats)

    fileTypes.forEach(val=>{
      let fileCount = this.state.inputFileFormats[val]

      for (let i=0;i<fileCount;i++)
      {
        dataDescriptionBoxes.push(this.dataDescriptionBox(val))
      }
    })
    return dataDescriptionBoxes
  }

  

  render() {
    const fileFormatDivs = [];

    for (let value of Object.keys(this.state.inputFileFormats)) {
      fileFormatDivs.push(this.createDivForFileInput(value));
    }

    return (
      <>
      <div className="w3-row">
        <div className="w3-display-container w3-content  w3-margin w3-col l2">
          <div className="w3-center w3-margin-bottom w3-margin-top w3-light-gray w3-padding w3-col">
            <div className="w3-container  w3-light-blue">
              <h2>
                <i className="fa fa-table w3-margin-right"></i> Add Dataset
              </h2>
            </div>
            <div className="w3-row-padding">{fileFormatDivs}</div>
            <button style={{display: this.state.showRecommendButton ? '' : 'none' }} onClick={this.describeData} className="w3-button w3-deep-purple">  Recommendation</button>
          </div>
        </div>

        <div className="w3-display-container w3-col l6">
          <div className="w3-padding-16">
            {this.createDataDescriptionBoxes()}
          </div>
        </div>
        <div className="w3-display-container w3-margin w3-col l2">
          <p>Recommendation</p>
          </div>
        </div>
      </>
    );
  }
}

export default Inputpage;
