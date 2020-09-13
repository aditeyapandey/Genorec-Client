import React from 'react';
import ReactJson from "react-json-view"
import Encoding from "../encodingselection/encoding"
import Recommendation from "../recommendation/container"
import testInputData from "../assets/input.json"

var genorecEngine = require("genorec-engine")

class Dataspec extends React.Component{

    fileReader;
    constructor(props) {
        super(props);
        //Upload Data
        this.state = {buttonDisplay:""};
        //Default Data
        let recommendation = genorecEngine.setInput(testInputData)
        this.state = {buttonDisplay:"",data:testInputData,recommendation};
      }
     handleFileRead = (e) => {
        const content = this.fileReader.result;
        let input
        try{
            input = JSON.parse(content)
            let recommendation = genorecEngine.setInput(input)
            this.setState({ data:input, buttonDisplay:"true", recommendation }); 
        }
        catch{
            this.setState({ data:input, buttonDisplay:"" }); 
            alert("JSON validation error!")
        }
      };

    onFileChange = event => { 
     
        // Read the file
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.handleFileRead;
        this.fileReader.readAsText(event.target.files[0]);  
      }; 

     
      

    render(){
        return(
            <>
            <div className="w3-half">
                <h3 >Data Specification </h3>
                <div className="w3-container w3-padding-32 " style={{margin:"32px 0"}}>
                    <input type="file" className="w3-button w3-indigo w3-margin-top w3-center" onChange={this.onFileChange}/>
                    <div className="w3-margin-top" style={{"maxHeight":"600px","overflowY":"scroll","textAlign":"left"}}>
                        {/* <ReactJson className="w3-margin-top" src={this.state.data} theme="monokai" validationMessage="Validation Error" displayDataTypes={false}	 />            */}
                        <ReactJson className="w3-left-align w3-margin-top JsonViewer" theme="apathy:inverted" indentWidth={"2"} src={this.state.data} valueRenderer={(raw) => <em>{raw}</em>}/>
                    </div>
                </div>
             </div>
             <div className="w3-half">
                 <Recommendation recommendation={this.state.recommendation}/>
            </div>
            </>
        )
    }
}

export default Dataspec;