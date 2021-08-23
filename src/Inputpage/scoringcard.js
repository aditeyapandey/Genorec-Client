import React from "react";


function ScoringCardUI(props){
  console.log(props);
  return (
    <>
      <div style={{display: props.display?"":"none"}} className="w3-container">
        <h4> On a scale of 1-5 how willing are you to accept the recommended visualization?</h4>
        <p> 
          <label>Less Willing</label>  
          <input className="w3-radio w3-margin" type="radio" name="score" value="1" />
          <label>1</label>
          <input className="w3-radio w3-margin" type="radio" name="score" value="2" />
          <label>2</label>
          <input className="w3-radio w3-margin" type="radio" name="score" value="3" />
          <label>3</label>
          <input className="w3-radio w3-margin" type="radio" name="score" value="4" />
          <label>4</label>
          <input className="w3-radio w3-margin" type="radio" name="score" value="5" />
          <label>5</label>
          <label className="w3-margin"> More Willing</label>  
        </p>

        <h5 style={{display: props.id === 1?"":"none"}}> After you have scored click on Submit to move to the next option.</h5>
        <h5 style={{display: props.id === 2?"":"none"}}> Submit the score and click on Next Task button on top to move to the next task.</h5>
        <button onClick={props.handler}> Submit </button>
      </div>
    </>
  );
}

export default ScoringCardUI;


