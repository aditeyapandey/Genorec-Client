import React, { useState, useEffect, useMemo } from "react";
import { GoslingComponent } from "gosling.js";
import { convert } from "./convert";
import { v1 } from 'uuid';
import "./Recommendation.css";


const getVisLabel = (spec) =>
{
  var sequences = Object.keys(spec["visDetails"])
  var attributes = []
  sequences.map(seq => 
    {
      var trackGroup = Object.keys(spec["visDetails"][seq]["visDetails"])
      console.log(trackGroup)
      return trackGroup.map(tG => 
        {
                var tracks = Object.keys(spec["visDetails"][seq]["visDetails"][tG]["visDetails"])
                tracks.map(track => {
                  let attributesObjKeys = Object.keys(spec["visDetails"][seq]["visDetails"][tG]["visDetails"][track]["visDetails"])
                  attributesObjKeys.map( attribute=>{
                    let attributeVal = spec["visDetails"][seq]["visDetails"][tG]["visDetails"][track]["visDetails"][attribute]
                    attributes.push(attributeVal["encoding"])
                  })
                })
            
    })
  })
  let uniqueAttr = [...new Set(attributes)];
  var visName = uniqueAttr.length === 1 ? uniqueAttr[0] :  uniqueAttr.slice(0, uniqueAttr.length - 1).join(', ') + " and " + uniqueAttr.slice(-1);
  
  return `This visualization below consists of ${visName}.`
}


const Recommendation = (props) => {
  const { 
    data: output, 
    width 
  } = props;

  return (
    <div className="gosling-recommendation-output">
      {
        convert(JSON.parse(JSON.stringify(output)), width).map((spec, index) => {
          return index < 5 ? (<>
            <div className="w3-center  w3-light-grey w3-padding">
              <h5>
                {" "}
                  {getVisLabel(output["recommendation_" + index])}
                {" "}
              </h5>
            </div>
          <GoslingComponent key={v1()} spec={spec}/></>) : null
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
