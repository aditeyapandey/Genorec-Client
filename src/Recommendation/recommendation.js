import React, { useState, useEffect, useMemo } from "react";
import { GoslingComponent } from "gosling.js";
import { convert } from "./convert";
import { v1 } from 'uuid';
import "./Recommendation.css";

const Recommendation = (props) => {
  const { 
    data: output, 
    width 
  } = props;

  return (
    <div className="gosling-recommendation-output">
      {
        convert(JSON.parse(JSON.stringify(output)), width).map((spec, i) => {
          return i < 10 ? <GoslingComponent key={v1()} spec={spec}/> : null
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
