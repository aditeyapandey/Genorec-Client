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
            binSize: granularity === 'segment' ? 4 : 2
        },
        dataTransform: { filter: 
            (
                availability === 'sparse' ? [
                    { field: 'sample', oneOf: [i + ''], not: false },
                    { field: 'peak', inRange: [0.0001, 0.0008] }
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
    granularity = 'point',
    cI = 0
) {
    const base = {
        title,
        style: { outlineWidth: 1}, // outline: 'black', outlineWidth: 0.5
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
                color: { value: getSampleColor(cI) }
            }
        case 'barchart':
        case 'intervalBarchart':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { value: getSampleColor(cI) },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'heatmap':
        case 'intervalHeatmap':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'rect',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                color: { field: 'peak', type: 'quantitative'},
            }
        case 'heatmap.barchart':
        case 'barchart.heatmap':
        case 'intervalHeatmap.intervalBarchart':
        case 'intervalBarchart.intervalHeatmap':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'start', type: 'genomic' },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                color: { field: 'peak', type: 'quantitative'},
                stroke: { value: 'white' },
                strokeWidth: { value: 0.5 },
            }
        case 'barchartCN':
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
        case 'intervalBarchart.intervalBarchartCN':
        case 'intervalBarchartCN.intervalBarchart':
        case 'barchartCN.barchart':
        case 'barchart.barchartCN':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'bar',
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { field: 'start', type: 'nominal' },
            }
        case 'heatmap.dotplot':
        case 'dotplot.heatmap':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'point',
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { field: 'peak', type: 'quantitative' },
            }
        case 'dotplot':
            return {
                ...base,
                ...getMultivecData(i, granularity, availability),
                mark: 'point',
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: getSampleColor(cI) }
            }
        case 'dotplot.barchartCN':
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
        case 'link':
            return {
                ...base,
                data: {
                    url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
                    type: "csv",
                    chromosomeField: "c2",
                    genomicFields: ["s1", "e1", "s2", "e2"]
                  },
                     mark: "link",
                    x: { field: "s1", type: "genomic" },
                    xe: { field: "e1", type: "genomic" },
                    x1: { field: "s2", type: "genomic" },
                    x1e: { field: "e2", type: "genomic" },
                  color: { value: "none"},
                  stroke: { value: "gray"},
                  opacity: { value: 0.3}
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
                    {"index": 3, "name": "name", "type": "nominal"},
                    {"index": 4, "name": "4", "type": "nominal"},
                    {"index": 6, "name": "6", "type": "nominal"},
                    {"index": 7, "name": "7", "type": "nominal"},
                    {"index": 8, "name": "8", "type": "nominal"},
                    {"index": 9, "name": "9", "type": "nominal"},
                    {"index": 10, "name": "10", "type": "nominal"},
                    {"index": 11, "name": "11", "type": "nominal"},
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
                    text: {field: ['name', 'strand', '4', '6', '7', '8', '9', '10', '11'][i % 4], 'type': 'nominal'},
                    "x": {"field": "start", "type": "genomic"},
                    "xe": {"field": "end", "type": "genomic"},
                "color": {
                  "value": "gray"
                },
                "opacity": {"value": 0.8}
              }
        case 'matrix':
            return {
                ...base,
                title: 'matrix',
                style: { outline: "black", outlineWidth: 2 },
                static: true,
                "data": {
                  "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                  "type": "multivec",
                  "row": "sample",
                  "column": "position",
                  "value": "peak",
                  "categories": [
                    "1", "2", "3", "4", "5",
                    "11", "12", "13", "14", "15",
                    "21", "22", "23", "24", "25",
                    "31", "32", "33", "34", "35",
                    "41", "42", "43", "44", "45"
                  ],
                  "binSize": 16
                },
                "mark": "rect",
                "x": {"field": "start", "type": "genomic", "axis": "none"},
                "xe": {"field": "end", "type": "genomic"},
                "row": {"field": "sample", "type": "nominal"},
                "color": {"field": "peak", "type": "quantitative"},
                height: width
              }
        default:
            console.error('Unexpected encoding:', encoding);
            return {
                ...base,
                title: encoding,
                height: width,
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
                style: { background: 'lightgray', outline: 0.5 }
            }
    }
}