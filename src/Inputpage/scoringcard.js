import React from "react";


function ScoringCardUI(props){
  console.log(props);
  return (
    <>
      <div style={{display: props.display?"":"none"}} className="w3-container">
        <h4> I am willing to use the recommended visualization for the analysis of the data and task description. </h4>
        <p> 
          <input className="w3-radio w3-margin-left" type="radio" name="score" value="1" />
          <label>Strongly Disagree</label>
          <input className="w3-radio w3-margin-left" type="radio" name="score" value="2" />
          <label>Disagree</label>
          <input className="w3-radio w3-margin-left" type="radio" name="score" value="3" />
          <label>Neutral</label>
          <input className="w3-radio w3-margin-left" type="radio" name="score" value="4" />
          <label>Agree</label>
          <input className="w3-radio w3-margin-left" type="radio" name="score" value="5" />
          <label>Strongly Agree</label>
        </p>

        <h5 style={{display: props.id === 1?"":"none"}}> After you have scored click on Submit to move to the next option.</h5>
        <h5 style={{display: props.id === 2?"":"none"}}> Submit the score and click on Next Task button on top to move to the next task.</h5>
        <button onClick={props.handler}> Submit </button>
      </div>
    </>
  );
}

export default ScoringCardUI;


