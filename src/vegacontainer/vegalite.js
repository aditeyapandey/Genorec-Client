import React from 'react';
import { VegaLite } from 'react-vega'



class Vega extends React.Component{

    constructor(props) {
        super(props);
      }

     spec = {
        width: 400,
        height: 200,
        mark: 'bar',
        encoding: {
          x: { field: 'a', type: 'ordinal', "axis": {
            "labels": false, "ticks":false
          } },
          y: { field: 'b', type: 'quantitative', "axis": {
            "labels": false, "ticks":false
          } },
        },
        data: { name: 'table' }, // note: vega-lite data attribute is a plain object instead of an array
      };
      
       barData = {
        table: [
            { a: 'A', b: 28 },
            { a: 'B', b: 55 },
            { a: 'C', b: 43 },
            { a: 'D', b: 91 },
            { a: 'E', b: 81 },
            { a: 'F', b: 53 },
            { a: 'G', b: 19 },
            { a: 'H', b: 87 },
            { a: 'I', b: 52 },
          ],
      };

      render(){
          return(<>
            <VegaLite spec={this.spec} data={this.barData} />
          </>)
      }

}

export default Vega