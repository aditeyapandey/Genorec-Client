import React from "react";
import Inputpage from "../Inputpage/Inputpage";
import globalData from "../global/globalvar";



class Evaluation extends React.Component{

  constructor(props) {
    super(props);
    console.log("test");
    this.state = {
      recommendationTaskId: 0,
      currentNotTaskCompleted: true,
      mode:"Eval-Mode",
      startStudy:"none",
      showInstruction:""
    };
    this.moveToNextTask = this.moveToNextTask.bind(this);
    this.makeTaskButtonActive = this.makeTaskButtonActive.bind(this);
    this.startStudyButton = this.startStudyButton.bind(this);
    this.referenceId = this.generateRandomReferenceId(10, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    console.log(this.referenceId);
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
        currentNotTaskCompleted: false
      });
    }
  }

  makeTaskButtonActive()
  {
    this.setState({
      currentNotTaskCompleted: false
    });
  }

  startStudyButton()
  {
    this.setState({
      startStudy:"",
      showInstruction:"none"
    });
  }

  generateRandomReferenceId(length,chars)
  {
    let result = "";
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }


  render(){
    return(
      <>

        {/* <div id="evalInstruction" className="w3-padding w3-display-container w3-margin">
          <div className="w3-row w3-center">
            <h2>User Study</h2>
          </div>

          <div className="w3-row">
            <h4> Referece Id: RANDOM NUMBER </h4>
          </div>
        </div> */}

        <div style={{display:this.state.showInstruction}} className="w3-row-padding w3-padding-64 w3-container">
          <div className="w3-content">
            <div className="">
              <h1>GenoREC Study</h1>
              <p className=""> GenoREC is a novel genomics visualization tool. It recommends genomics data visualization on the basis of data and task description.</p>

              <p className="">In this study, you will anlayze and rate the visualization recommendations from GenoREC system.  </p>
              <p> We estimate that this study will take you 15-20 mins. </p> 
                           
              <p className="w3-text-red">Before starting this study please complete the three tasks listed in the Pre-Evaluation Tasks panel.</p>

              <div className="userinstruction">
                <h3 className="w3-padding-16">Pre-Evaluation Tasks</h3>
                <ol className="w3-ul">
                  <li>Read the informational document. <i className="fa fa-external-link" aria-hidden="true"></i>
                  </li>
                  <li>Complete a short informational survey. You will need the <u>Reference Id: {this.referenceId}</u> to complete the survey. <i className="fa fa-external-link" aria-hidden="true"></i>
                  </li>
                  <li>Watch the GenoREC Tutorial.</li>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/njVXRH4h6DM" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </ol>
              </div>

              <h3>Questions? <i className="fa fa-fw fa-envelope"></i> <a href="mailto:pandey.ad@northeastern.edu">pandey.ad@northeastern.edu</a> or <a href="mailtosehi_lyi@hms.harvard.edu">sehi_lyi@hms.harvard.edu</a>   </h3>
              <button className="w3-button w3-light-green w3-right" onClick={this.startStudyButton} >Start Study</button> 

            </div>


          </div>
        </div>

        <div style={{display:this.state.startStudy}} className="evaluationpanel">     
          <div id="evaluationtask" className="w3-row-padding w3-padding-64 w3-container">
            <div className="w3-content">
              <div className="w3-row">
                <div className="w3-center w3-padding">
                  <h3>
                    {" "}
                    <i className="fa fa-flask" aria-hidden="true"></i> Evaluation Task {`${this.state.recommendationTaskId+1}/${globalData.evaluationTasks.length}`} {" "}
                  </h3>
                </div>
              </div>
              <h4> <strong> Data Description: </strong> {globalData.evaluationTasks[this.state.recommendationTaskId].dataDescription}  </h4>
              <h4> <strong>Task Description: </strong>  {globalData.evaluationTasks[this.state.recommendationTaskId].taskDescription} </h4>
              <h4> <strong> Objective Description: </strong> {globalData.evaluationTasks[this.state.recommendationTaskId].objectiveTaskDescription} </h4>
              <button className="w3-button w3-light-green w3-right" onClick={this.moveToNextTask} disabled={this.state.currentNotTaskCompleted}>Next Task</button> 
            </div>
          </div>
          <div key={this.state.recommendationTaskId} className="">
            <Inputpage data={this.state.mode} id={this.state.recommendationTaskId} enableNextTask={this.makeTaskButtonActive} />
          </div>
        </div>
      </>
    );
  }
}


export default Evaluation;