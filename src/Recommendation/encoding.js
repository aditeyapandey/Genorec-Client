import { getSampleColor } from './color';

export const EXAMPLE_DATASETS = {
    multivec: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
    fasta: 'https://resgen.io/api/v1/tileset_info/?d=WipsnEDMStahGPpRfH9adA',
    geneAnnotation: 'https://higlass.io/api/v1/tileset_info/?d=OHJakQICQD6gTD7skx4EWA',
    interaction: 'https://resgen.io/api/v1/tileset_info/?d=JzccFAJUQEiz-0188xaWZg',
    clinvar: 'https://cgap-higlass.com/api/v1/tileset_info/?d=clinvar_20200824_hg38',
    region: 'https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=SYZ89snRRv2YcxRwG_25_Q',
    region2: 'https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=HT4KNWdTQs2iN477vqDKWg'
};

/**
 * This generates good looking data based on granularity and availability.
 * @param {*} i 
 * @param {*} granularity 
 * @param {*} availability 
 */
export const getMultivecData = (i, granularity, availability) => {
    return {
        data: {
            url: EXAMPLE_DATASETS.multivec,
            type: 'multivec',
            row: 'sample',
            column: 'position',
            value: 'peak',
            categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
            binSize: granularity === 'segment' ? 8 : 1
        },
        dataTransform: { filter: 
            (
                availability === 'sparse' ? [
                    { field: 'sample', oneOf: [i + ''], not: false },
                    { field: 'peak', inRange: [0.0001, 0.0007] }
                ] : [
                    { field: 'sample', oneOf: [i + ''], not: false }
                ]
            ) 
        }
    }
}

// Default height of tracks
const height = 60;

export function encodingToGoslingTrack(
    encoding,
    width,
    i = 0,
    showAxis = false, 
    title = undefined,
    linkingID = undefined,
    availability = 'sparse',
    granularity = 'point'
) {
    const base = {
        // title,
        // style: { outline: 'black', outlineWidth: 0.5 },
        style: { outlineWidth: 1},
        width,
        height
    };
    const axis = showAxis ? 'bottom' : undefined;
    const domain = [undefined, { chromosome: '1' }][1];
    switch(encoding) {
        case 'linechart':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'line',
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { value: getSampleColor(i) }
            }
        case 'intervalBarchart':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { value: getSampleColor(i) },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'intervalHeatmap':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'rect',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                color: { field: 'peak', type: 'quantitative', range: 'warm'},
            }
        case 'intervalHeatmap.intervalBarchart':
        case 'intervalBarchart.intervalHeatmap':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { field: 'peak', type: 'quantitative', range: 'warm'},
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'intervalBarchart.intervalBarchartCN':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { field: 'start', type: 'nominal' },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'intervalBarchartCN':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'rect',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                color: { field: 'start', type: 'nominal' },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'dotplot':
            return {
                ...base,
                data: {
                    url: EXAMPLE_DATASETS.multivec,
                    type: 'multivec',
                    row: 'sample',
                    column: 'position',
                    value: 'peak',
                    categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
                    binSize: 8
                },
                dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
                mark: 'point',
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: getSampleColor(i) }
            }
        case 'barchartCN.barchart':
        case 'barchart.barchartCN':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'point',
                x: { field: 'position', type: 'genomic' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { field: 'start', type: 'nominal' },
            }
        case 'barchartCN.dotplot':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'point',
                x: { field: 'position', type: 'genomic' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { field: 'start', type: 'nominal' },
            }
        case 'linearLink':
            return {
                ...base,
                data: {
                  url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
                  type: "csv",
                  chromosomeField: "c2",
                  genomicFields: ["s1", "e1", "s2", "e2"]
                },
                overlay: [
                  {
                    mark: "link",
                    x: {
                      field: "s1",
                      type: "genomic",
                    //   domain,
                    //   axis,
                    //   linkingID
                    },
                    xe: { field: "e2", type: "genomic"},
                    // xe: { field: "e1", type: "genomic"},
                    // x1: { field: "s2", type: "genomic"},
                    // x1e: {field: "e2", type: "genomic"}
                  }
                ],
                color: { value: "none"},
                stroke: { value: "black"},
                opacity: { value: 0.5},
                style: { circularLink: false}
            }
        case 'circularLink':
            return {
                ...base,
                data: {
                    url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
                    type: "csv",
                    chromosomeField: "c2",
                    genomicFields: ["s1", "e1", "s2", "e2"]
                  },
                  overlay: [
                    {
                      mark: "link",
                      x: {
                        field: "s1",
                        type: "genomic",
                        // domain,
                        // axis,
                        // linkingID
                      },
                      xe: { field: "e1", type: "genomic"},
                      x1: { field: "s2", type: "genomic"},
                      x1e: {field: "e2", type: "genomic"}
                    }
                  ],
                  color: { value: "none"},
                  stroke: { value: "gray"},
                  opacity: { value: 0.3}
              }
        // case 'intervalBarchart.intervalBarchartCN':
        //     return {
        //         ...base,
        //         "data": {
        //             "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=clinvar-beddb",
        //             "type": "beddb",
        //             "genomicFields": [
        //               {"index": 1, "name": "start"},
        //               {"index": 2, "name": "end"}
        //             ],
        //             "valueFields": [
        //               {"index": 7, "name": "significance", "type": "nominal"}
        //             ]
        //           },
        //             "mark": "bar",
        //             "y": {
        //                 "field": "significance",
        //                 "type": "nominal",
        //                 "domain": [
        //                     "Pathogenic",
        //                     "Pathogenic/Likely_pathogenic",
        //                     "Likely_pathogenic",
        //                     "Uncertain_significance",
        //                     "Likely_benign",
        //                     "Benign/Likely_benign",
        //                     "Benign"
        //                 ],
        //                 // // "baseline": "Uncertain_significance",
        //                 // "range": [150, 20]
        //             },
        //             "stroke": {"value": "black"},
        //             "strokeWidth": {"value": 0.3},
                
        //           "color": {
        //             "field": "significance",
        //             "type": "nominal",
        //             "domain": [
        //               "Pathogenic",
        //               "Pathogenic/Likely_pathogenic",
        //               "Likely_pathogenic",
        //               "Uncertain_significance",
        //               "Likely_benign",
        //               "Benign/Likely_benign",
        //               "Benign"
        //             ],
        //             // "range": [
        //             //   "#CB3B8C",
        //             //   "#CB71A3",
        //             //   "#CB96B3",
        //             //   "gray",
        //             //   "#029F73",
        //             //   "#5A9F8C",
        //             //   "#5A9F8C"
        //             // ]
        //           },
        //           "x": {"field": "start", "type": "genomic"},
        //           "xe": {"field": "end", "type": "genomic"},
        //           "size": {"value": 4},
        //         // //   "opacity": {"value": 0.8},
        //         //   "width": 600,
        //         //   "height": 150
        //         }
        //     // return {
        //     //     ...base,
        //     //     data: {
        //     //         url: EXAMPLE_DATASETS.multivec,
        //     //         type: 'multivec',
        //     //         row: 'sample',
        //     //         column: 'position',
        //     //         value: 'peak',
        //     //         categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
        //     //         binSize: 8
        //     //     },
        //     //     dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
        //     //     mark: 'bar',
        //     //     x: {
        //     //         field: 'start',
        //     //         type: 'genomic',
        //     //         domain,
        //     //         // axis,
        //     //         linkingID
        //     //     },
        //     //     xe: { field: 'end', type: 'genomic' },
        //     //     y: { field: 'peak', type: 'quantitative' },
        //     //     stroke: { value: 'white' },
        //     //     strokeWidth: { value: 0.3 },
        //     //     // the only difference between 'barchart'
        //     //     color: { field: 'peak', type: 'nominal' }
        //     // }
        case 'heatmap':
            return {
                ...base,
                data: {
                    url: EXAMPLE_DATASETS.multivec,
                    type: 'multivec',
                    row: 'sample',
                    column: 'position',
                    value: 'peak',
                    categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
                    binSize: 8
                },
                dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
                mark: 'rect',
                x: {
                    field: 'start',
                    type: 'genomic',
                    // domain,
                    // axis,
                    // linkingID
                },
                xe: { field: 'end', type: 'genomic' },
                color: { field: 'peak', type: 'quantitative', range: 'spectral' }
            }
        
        case 'barchart':
            return {
                ...base,
                data: {
                    url: EXAMPLE_DATASETS.multivec,
                    type: 'multivec',
                    row: 'sample',
                    column: 'position',
                    value: 'peak',
                    categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
                    binSize: 8
                },
                dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
                mark: 'bar',
                x: {
                    field: 'start',
                    type: 'genomic',
                    // domain,
                    // axis,
                    // linkingID
                },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: getSampleColor(i) }
            }
        // case 'intervalBarchartCN':
        //     return {
        //         ...base,
        //         "data": {
        //           "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
        //           "type": "beddb",
        //           "genomicFields": [
        //             {"index": 1, "name": "start"},
        //             {"index": 2, "name": "end"}
        //           ],
        //           "valueFields": [
        //             {"index": 5, "name": "strand", "type": "nominal"},
        //             {"index": 3, "name": "name", "type": "nominal"}
        //           ],
        //           "exonIntervalFields": [
        //             {"index": 12, "name": "start"},
        //             {"index": 13, "name": "end"}
        //           ]
        //         },
        //            "dataTransform": {
        //               "filter": [
        //                 {"field": "type", "oneOf": ["gene"]},
        //                 // {"field": "strand", "oneOf": ["+"]}
        //               ]
        //             },
        //             "overlay": [
        //             {
        //                 "mark": "rect", 
        //                 "xe": {"field": "end", "type": "genomic"}
        //             },
        //             {
        //                 "mark": "rect",
        //                 stroke: { value: "#7585FF"},
        //                 strokeWidth: { value: 3},
        //             }
        //             ],
        //             "x": {"field": "start", "type": "genomic"},
        //             // "size": {"value": 30},
        //             "xe": {"field": "end", "type": "genomic"},
        //         "color": {
        //             field: 'strand', type: 'nominal', domain: ['+', '-']
        //         //   "value": "#7585FF"
        //         },
        //         "opacity": {"value": 0.8}
        //       }
        case 'barchartCN':
            return {
                ...base,
                data: {
                  url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/UCSC.HG38.Human.CytoBandIdeogram.csv",
                  type: "csv",
                  chromosomeField: "Chromosome",
                  genomicFields: ["chromStart", "chromEnd"]
                },
                mark: "rect",
                color: {
                  field: "Stain",
                  type: "nominal",
                  domain: [
                    "gneg",
                    "gpos25",
                    "gpos50",
                    "gpos75",
                    "gpos100",
                    "gvar",
                    "acen"
                  ],
                  range: [
                    "white",
                    "#D9D9D9",
                    "#979797",
                    "#636363",
                    "black",
                    "#F0F0F0",
                    "#8D8D8D"
                  ]
                },
                x: {
                    field: "chromStart", 
                    type: "genomic",
                    // domain,
                    // axis,
                    // linkingID
                },
                xe: {field: "chromEnd", type: "genomic"},
                stroke: {value: "lightgray"},
                strokeWidth: {value: 0.5},
                // outerRadius: 264,
                // innerRadius: 244,
                // superposeOnPreviousTrack: true
            }
        case 'annotation':
            return {
                ...base,
                "data": {
                  "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation",
                  "type": "beddb",
                  "genomicFields": [
                    {"index": 1, "name": "start"},
                    {"index": 2, "name": "end"}
                  ],
                  "valueFields": [
                    {"index": 5, "name": "strand", "type": "nominal"},
                    {"index": 3, "name": "name", "type": "nominal"}
                  ],
                  "exonIntervalFields": [
                    {"index": 12, "name": "start"},
                    {"index": 13, "name": "end"}
                  ]
                },
                   "dataTransform": {
                      "filter": [
                        {"field": "type", "oneOf": ["gene"]},
                        {"field": "strand", "oneOf": ["+"]}
                      ]
                    },
                    "mark": "text",
                    text: {field: 'name', 'type': 'nominal'},
                    "x": {"field": "start", "type": "genomic"},
                    // "size": {"value": 30},
                    "xe": {"field": "end", "type": "genomic"},
                "color": {
                    // field: 'name', type: 'nominal'
                  "value": "gray"
                },
                "opacity": {"value": 0.8}
              }
        default:
            console.error('Unexpected encoding:', encoding);
            return {
                ...base,
                data: {
                    url: EXAMPLE_DATASETS.multivec,
                    type: 'multivec',
                    row: 'sample',
                    column: 'position',
                    value: 'peak',
                    categories: ['-'],
                    binSize: 18
                },
                mark: 'bar',
                style: { background: 'lightgray' }
            }
    }
}