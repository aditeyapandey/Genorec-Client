import React from 'react';
import * as data from '../recommendation/data.js'; 


class Encoding extends React.Component{

    constructor(props) {
        super(props);
        this.state = {task1:false, task2: false, task3: false, task4:false};
        this.changeStatus = this.changeStatus.bind(this)
      }

      changeStatus = (val) =>
      {
          if(val=="task1"){
          this.setState({"task1":!this.state.task1})}
          if(val=="task2"){
            this.setState({"task2":!this.state.task2})}
      }

      openCity(evt,name) 
      {
        var i,tablinks;
        var x = document.getElementsByClassName("FeatureInput");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
      }
        
       tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
            }

        if(document.getElementById(name))     
            {document.getElementById(name).style.display = "block";}
            evt.currentTarget.className += " w3-grey";

    }      

    render(){
    return(
        <>
            <div className="w3-row-padding">
            <h3> Stage 1: Enconding Selection</h3>
            
            <div className="w3-bar w3-light-grey">
                <button  onClick={(e) => this.openCity(e,"Fname2")} className="w3-bar-item w3-button w3-grey tablink" >Feature 1</button>
                <button  onClick={(e) => this.openCity(e,"Fname2")} className="w3-bar-item w3-button tablink" >Feature 2</button>
                <button  onClick={(e) => this.openCity(e,"Fname3")} className="w3-bar-item w3-button tablink" >Feature 3</button>
            </div>
                <FeatureInputOutput id={"Fname1"} display={""} taskval={this.state} changeStatus={this.changeStatus}/>
                <FeatureInputOutput id={"Fname2"} display={"none"} taskval={this.state} changeStatus={this.changeStatus}/>
                <FeatureInputOutput id={"Fname3"} display={"none"} taskval={this.state} changeStatus={this.changeStatus}/>
            </div>             
        </>
    )
    }
}

function TaskInput(props){

   function handleChange () {
    props.changeStatus(props.name)           
    }    

    return(
        <div class="w3-col s3 w3-margin-bottom">
        <div class="w3-container w3-white" style = {props.status ? {"border-style":"solid", "border-color":"#80b1d3"}:{}} >
            <h4>Identify</h4>
            <img src={ require('../assets/test.png') } alt="Norway" style={{"width":"100%"}}/>
            <p>Few words to explain the task.Few words to explain the task.</p>
            <h6 class="w3-opacity">Examples: Functional Annotation, Find the Epigenetic Signal Value</h6>
            <button onClick={handleChange} class="w3-button w3-block w3-indigo w3-margin-bottom">Select</button>
        </div>
        </div>
    )
}

function EncodingOptions(props){
    return (
        <div class="w3-col s5 w3-margin w3-hover-opacity w3-border w3-border-gray w3-hover-border-red">
            <img src={ props.imgName } alt="Norway" style={{"width":"100%"}}/>

        </div>
    )
}

function FeatureInputOutput(props){
    return(
        <div id={props.id} className="FeatureInput" style={{"display":props.display}}>
             <div className="w3-col s9">

                <h3>1. Select the tasks.</h3>
                <div className="w3-row-padding w3-padding-16">
                    <TaskInput  status={props.taskval.task1} name="task1" changeStatus={props.changeStatus}/>
                    <TaskInput  status={props.taskval.task2} name="task2" changeStatus={props.changeStatus}/>
                    <TaskInput/>
                    <TaskInput/>
                </div>
            </div>
                {/* <div className="w3-col w3-center s3">
                <h3>Encoding Options</h3>
                    {data.encodingOptions.map((val) => {
                    return <EncodingOptions imgName={val} />
                })}
                </div> */}
        </div>
    )
}

export default Encoding;