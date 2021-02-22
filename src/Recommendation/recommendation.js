import React from "react";
import { GoslingComponent } from "gosling.js";


class Recommendation extends React.Component {
    render() {
      return (
        <GoslingComponent
          spec={{
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
          }}
          compiled={(spec, vConf) => { /* Callback function when compiled */ }}
        />
      );
    }
  }

  export default Recommendation;
