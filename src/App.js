import React from "react";
import "./App.css";
import Inputpage from "./Inputpage/Inputpage";
import Evaluation from "./evaluation/index";
import { BrowserRouter, Route, Switch } from "react-router-dom";


class App extends React.Component{ 

  constructor(props) {
    super(props);
    this.state = {currentState:0,"displayComponent":"Dataspec"};
    
    // this.nextState = this.nextState.bind(this)
  }

  // nextState(){

  //   this.setState({"currentState":this.state.currentState+1})

  //   if(this.state.currentState === 0){
  //     this.setState({"displayComponent":"Dataspec"})
  //   }

  //   if(this.state.currentState === 1){
  //     this.setState({"displayComponent":"Encoding"})
  //   }
  // }
  

  render(){
    return (
      <div className="App">
        <Header className="Header"/>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Inputpage}>
              <Inputpage data={"App-Mode"} />
            </Route>
            <Route path="/evaluation"  component={Evaluation}>
              <Evaluation />
            </Route>
          </Switch>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}

function Header(){
  return(
    <>
      <div className="w3-bar w3-white w3-border-bottom w3-xlarge">
        <a href="#"  className="w3-bar-item w3-button w3-text-red w3-hover-red"><b><i className={"fa fa-th-list w3-margin-right"}></i>GenoRec</b></a>
      </div>
    </>
  );
}

function Footer(){
  return (
    <>
      <div style={{clear:"both"}} className="w3-container w3-center w3-border-top w3-opacity w3-margin-top">
        <h5>MIT License</h5>
        <p>Created by <a href="https://www.aditeyapandey.com/" target="_blank" rel="noopener noreferrer" className="w3-hover-text-green">Aditeya Pandey</a></p>
      </div>
    </>
  );
}




export default App;
