import React from 'react';
import * as encoding from '../recommendation/data.js'; 


class Recommendation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {currentStep:1,"displayComponent":"Encoding"};
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        }

        nextStep() {
            this.state.currentStep = this.state.currentStep+1
            if(this.state.currentStep==2){
                this.setState({"displayComponent":"Combination"})
              }
        }    

        prevStep(){
            this.state.currentStep = this.state.currentStep-1
            if(this.state.currentStep==1){
                this.setState({"displayComponent":"Encoding"})
              }
        }

    render(){
        return(
            <>
             <div>
                <h3>Recommendation</h3>
                {(() => {
                switch (this.state.displayComponent) {
                case "Combination":   return <Combination/>;
                case "Encoding": return <Encoding attributes={this.props.recommendation != undefined ? this.props.recommendation.attributeEncoding : {} }  />;
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
            <div className="w3-row"> <h5 style={{"textAlign":"left"}}> Feature {i+1} </h5>
                 {representEachAttribute(attributes,i)} </div>)
        }
        );
    }

    function representEachAttribute(attributeList,featureId){
        var encodignRecommended = attributeList.map((encodingList,attributeId) =>{
        
            return encodingList.map((element) =>{
                var similarityScore = props["attributes"]["feature_"+featureId][attributeId]["similarityScore"][element]["tanimoto"]
                console.log(similarityScore)   
                return (        
                    <div class="w3-col s3 w3-margin-bottom">
                        <div class="w3-container w3-white">
                            <img src={ encoding.visuals[element] } alt="Norway" style={{"width":"100%"}}/>
                            <p> {element}</p>
                            <p class="w3-opacity">Attribute {attributeId+1}</p>
                            <p class="w3-opacity">Similarity {similarityScore.toFixed(4)*100}%</p>

                        </div>
                    </div>)
            })
        })
        return encodignRecommended
    }

    return (
        <>
            <div>
            <div className="w3-container w3-padding-32 " style={{margin:"32px 0"}}>
                 <h4>Enconding</h4>
                 {featureRows}
            </div>
            </div>
        </>
    )
}

function Combination()
{
    return(
        <>
        <div>
            <div className="w3-container w3-padding-32 " style={{margin:"32px 0"}}>
                 <h4>Combination</h4>
            </div>
        </div>
        </>
    )
}



export default Recommendation;