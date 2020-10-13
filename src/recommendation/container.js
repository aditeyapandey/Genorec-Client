import React from 'react';
import * as encoding from '../recommendation/data.js'; 
import Scatter from "../vegacontainer/scatter"



class Recommendation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {currentStep:0,"displayComponent":"Encoding"};
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        console.log(this.props)
        }

        nextStep() {
            var tablinks = document.getElementsByClassName("tablink");
            tablinks[this.state.currentStep].className = tablinks[this.state.currentStep].className.replace(" w3-light-grey", "");
            tablinks[this.state.currentStep+1].className += " w3-light-grey"; 

            this.state.currentStep = this.state.currentStep+1
            if(this.state.currentStep==1){
                this.setState({"displayComponent":"Tracks"})
              }
              if(this.state.currentStep==2){
                this.setState({"displayComponent":"Layout"})
              }
        }    

        prevStep(){

            var tablinks = document.getElementsByClassName("tablink");
            tablinks[this.state.currentStep].className = tablinks[this.state.currentStep].className.replace(" w3-light-grey", "");
            tablinks[this.state.currentStep-1].className += " w3-light-grey"; 


            this.state.currentStep = this.state.currentStep-1
            if(this.state.currentStep==0){
                this.setState({"displayComponent":"Encoding"})
              }
              if(this.state.currentStep==1){
                this.setState({"displayComponent":"Tracks"})
              }
        }

        openCity(evt,name) 
        {
          var i,tablinks;
          var x = document.getElementsByClassName("FeatureInput");
         
        console.log(this.state.displayComponent)
          
         tablinks = document.getElementsByClassName("tablink");
              for (i = 0; i < x.length; i++) {
                  tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
              }
  
        //   if(document.getElementById(name))     
        //       {document.getElementById(name).style.display = "block";}
        //       evt.currentTarget.className += " w3-grey";
  
      }      

    render(){
        return(
            <>
             <div>
                <h3 className="w3-center">Recommendation</h3>
                
                <div>
                <div className="w3-bar w3-indigo">
                <button id="EnocdingHighlight"  onClick={(e) => this.openCity(e,"Fname2")} className="w3-bar-item w3-button w3-light-grey tablink Encoding" >Encoding</button>
                <button id="TrackHighlight" onClick={(e) => this.openCity(e,"Fname2")} className="w3-bar-item w3-button tablink" >Tracks</button>
                <button  onClick={(e) => this.openCity(e,"Fname3")} className="w3-bar-item w3-button tablink" >Layout</button>
                <button  onClick={(e) => this.openCity(e,"Fname3")} className="w3-bar-item w3-button tablink" >Alignment</button>
                </div>
                
                 </div>        
                
                {(() => {
                switch (this.state.displayComponent) {
                case "Tracks":   return <Tracks data={this.props.recommendation != undefined ? this.props.recommendation.tracks : {} }/>;
                case "Encoding": return <Encoding attributes={this.props.recommendation != undefined ? this.props.recommendation.attributeEncoding : {} }  />;
                case "Layout": return <Layout data={this.props.recommendation != undefined ? this.props.recommendation.layout : {} }  />;
                default:      return <Encoding/>;
                }})()}

                 {/* <Encoding attributes={this.props.recommendation != undefined ? this.props.recommendation.attributeEncoding : {} } /> */}
                 <button onClick={this.prevStep} class="w3-button w3-left w3-indigo w3-margin-bottom">	&lt;&lt; Previous Step</button>
                 <button onClick={this.nextStep} class="w3-button w3-right w3-indigo w3-margin-bottom">Next Step &gt;&gt;</button>
            </div>
            </>)
    }
     
}

function Encoding(props){

    var features
    var predictedEncoding = []
    var featureRows

    if(props.attributes !=undefined){
        
        var obj = props.attributes
        features = Object.keys(obj).map((val) => {return obj[val]})

        features.forEach(element => {
            let allEncoding = []
            element.forEach(nextElement => {
                allEncoding.push(nextElement.recommendation)
            })

            predictedEncoding.push(allEncoding)
        });

        featureRows = predictedEncoding.map((attributes,i) =>{
            return  (
            <div className="w3-row w3-margin-left"> <h5 style={{"textAlign":"left"}}> Feature {i+1} </h5>
                 {representEachAttribute(attributes,i)} </div>)
        }
        );
    }

    function representEachAttribute(attributeList,featureId){
        const encodingRecommended = attributeList.map((encodingList,attributeId) =>{  
            return (<div class="w3-row w3-left w3-margin-left"> <h6 style={{"textAlign":"left"}}>Attribute {attributeId+1}</h6> {showEachAttributes(encodingList,featureId,attributeId)} </div>)
        })
        return encodingRecommended
    }

    function showEachAttributes(encodingList,featureId,attributeId){
         const attributeRecommendation = encodingList.map((element) =>{
                var similarityScore = props["attributes"]["feature_"+featureId][attributeId]["similarityScore"][element]["tanimoto"]
                return (      
                      
                    <div class="w3-col s3 w3-margin-bottom">
                        <div class="w3-container w3-center w3-white">
                            <img src={ encoding.visuals[element] } alt="Norway" style={{"width":"100%"}}/>
                            {/* <Scatter /> */}
                            <p> {element}</p>
                            <p class="w3-opacity">Score {similarityScore.toFixed(4)*100}%</p>
                        </div>
                    </div>)
            })
            return attributeRecommendation
    }

    return (
        <>
            <div>
            <div className="w3-container w3-padding">
                 {featureRows}
            </div>
            </div>
        </>
    )
}

function Tracks(props)
{
    var featureRows 

    if(props.data!=undefined){
        var featuresData = props.data
        featureRows = featuresData.map((feature,i) =>{
            var trackPossibilities = feature["feature_"+i]["trackPossibilities"]
            return  (
            <div className="w3-row"> <h5 style={{"textAlign":"left"}}> Feature {i+1} </h5>
                 {representTracks(trackPossibilities,i)} </div>)
        })
    }

    function representTracks (trackPossibilities,featureId){
        return trackPossibilities.map((element, i) =>{
        return( <div className="w3-row w3-margin-left"> Track Option {i+1} {showTrackElements(element)}</div>)
        })
    }

    function showTrackElements(trackElements){
        return trackElements.map((group) =>{
            const sortedArr = group.sort(function(a, b) {
                return parseInt(a["attributeId"].split("_")[1]) - parseInt(b["attributeId"].split("_")[1]) ;
            });
            return (
                <div class="w3-container w3-white">
                {
                    group.map(groupElement =>{
                        const encodingName = groupElement["encoding"]
                        const attributeId = parseInt(groupElement["attributeId"].split("_")[1]) + 1
                        return (
                            <div class="w3-col w3-center s3 w3-margin-bottom">
                            <div class="w3-container w3-white">
                                <img src={ encoding.visuals[encodingName] } alt="Norway" style={{"width":"100%"}}/>
                                <p> {encodingName}</p>
                                <p class="w3-opacity">Attribute {attributeId}</p>  
                                <p> {sortedArr.length>=2 ? "Combined/Superimposed":""}</p>
                            </div>
                            </div>
                        )
                    })
                }
                </div>
            )
        })
    }
    
    return(
        <>
        <div>
            <div className="w3-container w3-padding" >
                 {featureRows}
            </div>
        </div>
        </>
    )
}

function Layout(props){

    var featureRows 

    if(props.data!=undefined){
        var featuresData = Object.keys(props.data)
        featureRows = featuresData.map((feature,i) =>{
            var trackPossibilities = props.data[feature]
            console.log(trackPossibilities)
            return  (
            <div className="w3-row w3-margin-left"> <h5 style={{"textAlign":"left"}}> Feature {i+1} </h5>
              {representTracks(trackPossibilities,i)}   </div>)
        })
    }

    function representTracks (trackPossibilities,featureId){

        return trackPossibilities.map((element, i) =>{
        const layoutReco = element["layoutRecommendation"] 
        return( <div className="w3-row w3-margin-left"> <h6>Layout Option {i+1} </h6> 

                <div class=" w3-row w3-col w3-center s3 w3-margin-bottom">
                    <div class="w3-container w3-white">
                        <img src={ encoding.visuals[layoutReco] } alt="Norway" style={{"width":"100%"}}/>
                        <p> </p>
                    </div>
                </div>
        
         </div>)
        })
    }

    return (
        <>
        <div>
        <div className="w3-container w3-padding">
             <h4>Layout</h4>
             {featureRows}
        </div>
        </div>
    </>
    )
}


export default Recommendation;