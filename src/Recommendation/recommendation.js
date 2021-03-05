import React, { useState, useEffect, useMemo } from "react";
import { GoslingComponent } from "gosling.js";
import { convert } from "./convert";
import { v1 } from 'uuid';
import "./Recommendation.css";


const getVisLabel = (spec) =>
{
  console.log(spec)
  var sequences = Object.keys(spec["visDetails"])
  console.log(sequences)
  var attributes = []
  var trackGroup = sequences.map(val => Object.keys(spec["visDetails"][val]["visDetails"]))
  
  var tracks = sequences.map(seq => {
    return trackGroup.map(tG => 
      {
        return tG.map(tGVal =>  
          { 
          var tracks = Object.keys(spec["visDetails"][seq]["visDetails"][tGVal]["visDetails"])
              tracks.map(track => {
                let attributesObjKeys = Object.keys(spec["visDetails"][seq]["visDetails"][tGVal]["visDetails"][track]["visDetails"])
                attributesObjKeys.map( attribute=>{
                  let attributeVal = spec["visDetails"][seq]["visDetails"][tGVal]["visDetails"][track]["visDetails"][attribute]
                  attributes.push(attributeVal["encoding"])
                })
              })
          })
      })
  })
  let uniqueAttr = [...new Set(attributes)];
  var visName = uniqueAttr.length === 1 ? uniqueAttr[0] :  uniqueAttr.slice(0, uniqueAttr.length - 1).join(', ') + " and " + uniqueAttr.slice(-1);
  return `Visual Encodings Used: ${visName}`
}


const Recommendation = (props) => {
  const { 
    data: output, 
    width 
  } = props;

  return (
    <div className="gosling-recommendation-output">
      {
        convert(JSON.parse(JSON.stringify(output)), width).map((spec,index) => {
          return (<>
                <div className="w3-center  w3-light-grey w3-padding">
                      <h5>
                        {" "}
                         {getVisLabel(output["recommendation_"+index])}
                         {" "}
                      </h5>
                </div>
          <GoslingComponent key={v1()} spec={spec}/></>)
        })
      }
    </div>
  );
}

export const testGosSpec = {
  "tracks": [
    {
      "data": {
        "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
        "type": "multivec",
        "row": "sample",
        "column": "position",
        "value": "peak",
        "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
      }
    }
  ]
}

export default Recommendation;
