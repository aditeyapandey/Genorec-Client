import React from "react";
import Inputpage from "../Inputpage/Inputpage";
import globalData from "../global/globalvar";



class Evaluation extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      recommendationTaskId: 0,
      currentTaskCompleted: false
    };
    this.moveToNextTask = this.moveToNextTask.bind(this);

  }

  moveToNextTask()
  { 
      
    let currentTaskId = this.state.recommendationTaskId;
    console.log(currentTaskId,globalData.evaluationTasks.length);

    //Logic to check if the user has completed the task!!
    if(currentTaskId<globalData.evaluationTasks.length-1)
    {
      this.setState({
        recommendationTaskId: currentTaskId + 1
      });
    }
    else{
      this.setState({
        currentTaskCompleted: true
      });
    }
  }


  render(){
    return(
      <>
           
        <div id="evaluation" className="w3-padding w3-display-container w3-margin">

          <div className="w3-row">
            <div className="w3-center w3-padding">
              <h3>
                {" "}
                <i className="fa fa-flask" aria-hidden="true"></i> Evaluation Task {" "}
              </h3>
            </div>
          </div>
          <h4>Data Description: {globalData.evaluationTasks[this.state.recommendationTaskId].dataDescription} </h4>
          <h4>Task Description: {globalData.evaluationTasks[this.state.recommendationTaskId].taskDescription} </h4>
          <h4>Objective Description: {globalData.evaluationTasks[this.state.recommendationTaskId].objectiveTaskDescription} </h4>
          <button className="w3-button w3-light-green" onClick={this.moveToNextTask} disabled={this.state.currentTaskCompleted}>Next Task</button> 

        </div>
        <Inputpage data={"Eval-Mode"}/>
  
      </>
    );
  }
}


export default Evaluation;