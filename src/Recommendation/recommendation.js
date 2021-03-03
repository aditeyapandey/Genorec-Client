import React, { useState, useEffect } from "react";
import { GoslingComponent } from "gosling.js";
import { convert } from "./convert";
import "./Recommendation.css";

function Recommendation(props)  {
  const { data: output, width } = props;

  // console.log('props', props);
  
  const [goslingSpecs, setGoslingSpecs] = useState(convert(JSON.parse(JSON.stringify(output)), width));

  // Just received a new GenoRect output
  useEffect(() => {
    setGoslingSpecs(convert(JSON.parse(JSON.stringify(output)), width));
  }, [output]);

  console.log("goslingSpecs", goslingSpecs);
  // tasks
  // recommendationOutputSpec.tasks

  // console.log(JSON.stringify(props.recommendationOutputSpec));
  

  return (
    <div className="gosling-recommendation-output">
      {goslingSpecs.map(spec => 
        <GoslingComponent
          key={JSON.stringify(spec)}
          spec={spec}
          compiled={(spec, vConf) => { /* Callback function when compiled */ }}
        />
      )}
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
