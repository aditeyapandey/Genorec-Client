import React from 'react';
import './Inputpage.css';
import { inputFileFormats } from "../global/globalvar"

class Inputpage extends React.Component{

  constructor(props) {
    super(props);
    console.log(inputFileFormats)
    this.state = {"minFiles":0,"maxFiles":5,"bed":0};
    this.onChangeFileQuantity = this.onChangeFileQuantity.bind(this);
    }

 onChangeFileQuantity(event){
   this.setState({
    "bed": event.target.value
  });
  }

  render() {
      return (
        <>
      <header className="w3-display-container w3-content AddData" >
        <div className="w3-center w3-padding w3-col">
            <div className="w3-container w3-red">
                <h2><i className="fa fa-table w3-margin-right"></i>Add Dataset</h2>
            </div>
            

            <div class="w3-row-padding">
                <div className="w3-quarter w3-margin-top w3-margin-bottom">
                  <label>BED</label>
                  <input className=" w3-input w3-border w3-center" onChange={this.onChangeFileQuantity} type="number" name="bed" value={this.state.bed}   min={this.state.minFiles} max={this.state.maxFiles}/>
               </div>
               <div className="w3-quarter w3-margin-top w3-margin-bottom">
                  <label>BED</label>
                  <input className=" w3-input w3-border w3-center" onChange={this.onChangeFileQuantity} type="number" name="bed" value={this.state.bed}   min={this.state.minFiles} max={this.state.maxFiles}/>
               </div>
             </div>
        </div>
      </header>
      </>
    )
  }
}


export default Inputpage;
