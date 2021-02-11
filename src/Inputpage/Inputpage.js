import React from "react";
import "./Inputpage.css";
import { inputFileFormats } from "../global/globalvar";

class Inputpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minFiles: 0, maxFiles: 5, inputFileFormats };
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    this.createDivForFileInput = this.createDivForFileInput.bind(this);

  }

  onChangeFileQuantity(event) {
    let inputFileFormats = { ...this.state.inputFileFormats };
    inputFileFormats[event.target.name] = event.target.value;
    this.setState({
      inputFileFormats: inputFileFormats,
    });
  }

  createDivForFileInput(name) {
    console.log(this.state.inputFileFormats[name])
    return (
      <>
        <div className="w3-quarter w3-margin-top w3-margin-bottom">
          <label>{name.toUpperCase()}</label>
          <input
            className=" w3-input w3-border w3-center"
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

  render() {
    const fileFormatDivs = [];

    for (let value of Object.keys(this.state.inputFileFormats)) {
      fileFormatDivs.push(this.createDivForFileInput(value));
    }

    return (
      <>
        <header className="w3-display-container w3-content AddData">
          <div className="w3-center w3-padding w3-col">
            <div className="w3-container w3-red">
              <h2>
                <i className="fa fa-table w3-margin-right"></i>Add Dataset
              </h2>
            </div>

            <div class="w3-row-padding">
              {fileFormatDivs}
            </div>
          </div>
        </header>
      </>
    );
  }
}

export default Inputpage;
