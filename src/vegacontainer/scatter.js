import React from 'react';
import { VegaLite } from 'react-vega'



class Scatter extends React.Component{

    constructor(props) {
        super(props);
      }

     spec = {
        width: 100,
        height: 100,
        mark: 'circle',
        encoding: {
          x: { field: 'Position', type: 'quantitative', "axis": {
            "labels": false, "ticks":false
          } },
          y: { field: 'Value', type: 'quantitative', "axis": {
            "labels": false, "ticks":false
          } },
        },
        data: { name: 'table' }, // note: vega-lite data attribute is a plain object instead of an array
      };
      
       barData = {
        table: [
            { Position: 1, Value: 28 },
            { Position: 2, Value: 55 },
            { Position: 3, Value: 43 },
            { Position: 4, Value: 91 },
            { Position: 5, Value: 81 }
          ],
      };

      render(){
          return(<>
            <VegaLite spec={this.spec} data={this.barData} />
          </>)
      }

}

export default Scatter