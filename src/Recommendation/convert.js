import get from 'lodash/get';

// !!! Use the name of internal variables same as the actual object key, if possible.
// Generate a key to directly access to certain props.
const GET_SEQUENCES_KEY = (recommendation_n) => `${recommendation_n}.visDetails`;
const GET_TRACK_GROUPS_KEY = (recommendation_n, Sequence_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails`;
const GET_TRACKS_KEY = (recommendation_n, Sequence_n, TrackGroup_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails`;
const GET_ATTRIBUTES_KSY = (recommendation_n, Sequence_n, TrackGroup_n, Track_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails.${Track_n}.visDetails`;

const getGosViewTemplate = () => {
    return {
        assembly: 'hg38',
        arrangement: 'vertical',
        centerRadius: 0.6,
        views: []
    }
}

/**
 * Convert a GenoRec recommendation spec to a list of Gosling specs.
 * @param {Object} genoRec Output description of GenoRec.
 * @param {number} width Size of recommended visualization along horizontal axis.
 * @returns {Array} An array of gosling specs.
 */
export function convert(...props){
    const [genoRec, baseWidth] = props;

    if(!genoRec) {
        // Recommendation spec is not ready.
        return [];
    }

    /* TASKS */
    // Possible elements: singleroi, multipleroi, multipleattributes, multiplefeatures, multiplesequences, overview
    const tasks = JSON.parse(JSON.stringify(genoRec)).tasks;

    const hasSingleRoi = tasks && tasks.includes('singleroi');
    const compareMultipleRoi = tasks && tasks.includes('multipleroi');
    
    let xDomain = undefined, xDomain2 = undefined;
    if(hasSingleRoi || compareMultipleRoi) {
        // This means we have at least one local ROI to show.
        xDomain = { chromosome: '8', interval: [127736068, 127741434]};
    }

    if(compareMultipleRoi) {
        // This means we will compare multiple, here two, regions.
        xDomain2 = { chromosome: '12', interval: [6445000, 6485000]};
    }
    
    // For the convenience, remove tasks and have only `recommendation_*`
    delete genoRec.tasks;

    const width = compareMultipleRoi ? baseWidth / 2.0 : baseWidth;

    // DEBUG
    // console.log('genoRec', genoRec);
    //

    const goslings = [];

    /**
     * This is the list of recommendations
     */
    Object.keys(genoRec).forEach((recommendation_n, i) => {
        const recommendationObj = genoRec[recommendation_n];
        const { arrangement } = recommendationObj;

        if(arrangement !== 'linearStacked') {
            // Check whether we do not handle arrangement well.
            console.error('arrangement is not linearStacked', arrangement);
        }

        /**
         * Incoming View
         */
        let GOS_VIEW = {
            ...getGosViewTemplate(),
            xDomain
        };

        const TRACK_HEIGHT_WITH_AXIS = 80;
        const TRACK_HEIGHT_WITHOUT_AXIS = 50;
        const TRACK_HEIGHT_CIRCULAR = 401;

        /* Collection of Sequence_ */
        const sequencesKey = GET_SEQUENCES_KEY(recommendation_n);
        const sequencesObj = get(genoRec, sequencesKey);

        // divide size
        // gosling.arrangement.columnSizes /= Object.keys(sequencesObj).length;
        
        let numOfTracks = 0;
        Object.keys(sequencesObj).forEach(Sequence_n => {
            const sequenceObj = sequencesObj[Sequence_n];
            const { trackAlignment } = sequenceObj;
            
            /**
             * Group of tracks, i.e., view
             */
            const tracks = [];
            let viewLayout = null;

            /* Collection of TrackGroup_ */
            const trackGroupsKey = GET_TRACK_GROUPS_KEY(recommendation_n, Sequence_n);
            const trackGroupsObj = get(genoRec, trackGroupsKey);
            Object.keys(trackGroupsObj).forEach(trackGroup_n => {
                const trackGroup = trackGroupsObj[trackGroup_n];
                const { layout, interconnection } = trackGroup;

                if(!viewLayout) {
                    viewLayout = layout;
                } else if(viewLayout !== layout) {
                    console.error('layout is different across tracks');
                }

                /* Collection of Track_ */
                const tracksKey = GET_TRACKS_KEY(recommendation_n, Sequence_n, trackGroup_n);
                const tracksObj = get(genoRec, tracksKey);
                Object.keys(tracksObj).forEach((Track_n, Track_i) => {
                    const track = tracksObj[Track_n];
                    const { groupingTechnique } = track; // typeof 'superposed' | 'combined' | 'none'

                    /* Collection of Attribute_ */
                    const attributesKey = GET_ATTRIBUTES_KSY(recommendation_n, Sequence_n, trackGroup_n, Track_n);
                    const attributesObj = get(genoRec, attributesKey);
                    
                    Object.keys(attributesObj).forEach((Attribute_n, Attribute_i) => {
                        if(groupingTechnique === 'combined' && Attribute_i !== 0) {
                            // We only add a single track when multiple attributes are encoded together, so let's get out of this scrope.
                            return;
                        }

                        if(interconnection && layout === 'linear' && Track_i === 0) {
                            // Let's add a link on the top
                            tracks.push({
                                ...JSON.parse(JSON.stringify(encodingToGoslingTrack(
                                    'linearLink', 
                                    width,
                                    numOfTracks++,
                                    false,
                                    // show title only on the first track
                                    undefined,
                                    Sequence_n
                                ))),
                                layout: 'linear'
                            });
                            // gosling.arrangement.rowSizes.push(TRACK_HEIGHT_WITHOUT_AXIS);
                        }

                        const attribute = attributesObj[Attribute_n];
                        let { encoding } = attribute;

                        /// DEBUG
                        console.log(tasks, arrangement, trackAlignment, layout, groupingTechnique, encoding);
                        ///

                        if(groupingTechnique === 'combined') {
                            // If combined, we get the second encoding
                            // NOTE: Only two `encoding` can be combined in the GenoRec output
                            if(Object.keys(attributesObj).length <= Attribute_i + 1) {
                                // We did not find the second one.
                                console.warn("Output file format is incorrect. Two attributes should be provided for a `combined` grouping technique.");
                            } else {
                                // Let's combine the two
                                const nextAttribute = attributesObj[Object.keys(attributesObj)[Attribute_i + 1]];
                                // if `heatmap` and `barchartCN` is combined, it will look like "barchartCN.heatmap"
                                encoding = [encoding, nextAttribute.encoding].sort().join('.');
                            }
                        }

                        const isAxisShown = Track_i === Object.keys(tracksObj).length - 1;
                        const overlayOnPreviousTrack = (
                            (trackAlignment === 'superimposed') ||
                            (groupingTechnique === 'superposed' && Attribute_i !== 0)
                            //  ||  (layout === 'circular' && Track_i !== 0)
                        );
                        
                        // Title of track
                        const title = `${trackGroup_n}.${Track_n}.${Attribute_n}`;

                        // Height of circular ring
                        const ringSize = (isAxisShown ? TRACK_HEIGHT_WITH_AXIS : TRACK_HEIGHT_WITHOUT_AXIS) / 2.0;

                        // Add a single Gosling track
                        tracks.push({
                            ...JSON.parse(JSON.stringify(encodingToGoslingTrack(
                                encoding, 
                                width,
                                numOfTracks++,
                                isAxisShown,
                                // show title only on the first track
                                title,
                                Sequence_n
                            ))),
                            overlayOnPreviousTrack
                        });

                        // Update titles when multiple tracks are superposed
                        if(overlayOnPreviousTrack && tracks.length - 2 >= 0) {
                            // When superposed, we need to have only one title, so concat them in the last track.
                            tracks[tracks.length - 1].title = (
                                tracks[tracks.length - 2].title + ' + ' + tracks[tracks.length - 1].title
                            );
                            tracks[tracks.length - 2].title = undefined;
                        }

                        // gosling.arrangement.rowSizes.push(layout === 'circular' ? TRACK_HEIGHT_CIRCULAR : isAxisShown ? TRACK_HEIGHT_WITH_AXIS : TRACK_HEIGHT_WITHOUT_AXIS);

                        // if(layout === 'circular') {
                        //     outerRadius -= (ringSize + 4 /* small gap */);
                        // }

                        if(interconnection && layout === 'circular' && Track_i === Object.keys(tracksObj).length - 1) {
                            console.error('ever here?');
                            // Let's add a link on the center
                            tracks.push({
                                ...JSON.parse(JSON.stringify(encodingToGoslingTrack(
                                    'circularLink', 
                                    width,
                                    numOfTracks++,
                                    false,
                                    // show title only on the first track
                                    undefined,
                                    Sequence_n,
                                ))),
                                overlayOnPreviousTrack
                            });
                        }
                    });
                });
            });
            // console.log(GOS_VIEW, tracks);
            GOS_VIEW.views.push({
                layout: viewLayout,
                spacing: 1,
                tracks
            });
        });
        // console.log('gosling', GOS_VIEW);

        // Finish creating a view! (1) Add a title and (2) add an adjacent view for comparison
        const title = `Recommendation ${i + 1}`;
        if(compareMultipleRoi) {
            GOS_VIEW = {
                ...getGosViewTemplate(),
                title,
                arrangement: 'horizontal',
                views: [
                    {...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain},
                    {...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain: xDomain2}
                ]
            }
        } else {
            GOS_VIEW = {...GOS_VIEW, title }
        }

        goslings.push(GOS_VIEW);
    }); // end of iteration on recommendations
    console.log('Final Goslings', goslings);
    return JSON.parse(JSON.stringify(goslings));
}

export const EXAMPLE_DATASETS = {
    multivec: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
    fasta: 'https://resgen.io/api/v1/tileset_info/?d=WipsnEDMStahGPpRfH9adA',
    geneAnnotation: 'https://higlass.io/api/v1/tileset_info/?d=OHJakQICQD6gTD7skx4EWA',
    interaction: 'https://resgen.io/api/v1/tileset_info/?d=JzccFAJUQEiz-0188xaWZg',
    clinvar: 'https://cgap-higlass.com/api/v1/tileset_info/?d=clinvar_20200824_hg38',
    region: 'https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=SYZ89snRRv2YcxRwG_25_Q',
    region2: 'https://resgen.io/api/v1/gt/paper-data/tileset_info/?d=HT4KNWdTQs2iN477vqDKWg'
};

// Taken from https://mode.com/blog/custom-color-palettes/
const _SAMPLE_COLOR_PALETTE = [
    '#38B067',
    '#6297BB',
    '#ECB40E',
    '#80D7C1',
    '#9F8CAE',
    '#EB6672',
    '#376C72',
    '#EE9CCC',
    '#E4781B',
    '#9F775D'
];
const GET_SAMPLE_COLOR = (i) => {
    return _SAMPLE_COLOR_PALETTE[i % _SAMPLE_COLOR_PALETTE.length];
}

function encodingToGoslingTrack(
    encoding,
    width,
    i = 0, 
    showAxis = false, 
    title = undefined,
    linkingID = undefined,
) {
    const base = {
        title,
        style: { outline: 'black', outlineWidth: 0.5 },
        width,
        height: 80
    };
    const axis = showAxis ? 'bottom' : undefined;
    const domain = [undefined, { chromosome: '1' }][1];
    switch(encoding) {
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
        case 'intervalBarchart.intervalBarchartCN':
            return {
                ...base,
                "data": {
                    "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=clinvar-beddb",
                    "type": "beddb",
                    "genomicFields": [
                      {"index": 1, "name": "start"},
                      {"index": 2, "name": "end"}
                    ],
                    "valueFields": [
                      {"index": 7, "name": "significance", "type": "nominal"}
                    ]
                  },
                    "mark": "bar",
                    "y": {
                        "field": "significance",
                        "type": "nominal",
                        "domain": [
                            "Pathogenic",
                            "Pathogenic/Likely_pathogenic",
                            "Likely_pathogenic",
                            "Uncertain_significance",
                            "Likely_benign",
                            "Benign/Likely_benign",
                            "Benign"
                        ],
                        // // "baseline": "Uncertain_significance",
                        // "range": [150, 20]
                    },
                    "stroke": {"value": "black"},
                    "strokeWidth": {"value": 0.3},
                
                  "color": {
                    "field": "significance",
                    "type": "nominal",
                    "domain": [
                      "Pathogenic",
                      "Pathogenic/Likely_pathogenic",
                      "Likely_pathogenic",
                      "Uncertain_significance",
                      "Likely_benign",
                      "Benign/Likely_benign",
                      "Benign"
                    ],
                    // "range": [
                    //   "#CB3B8C",
                    //   "#CB71A3",
                    //   "#CB96B3",
                    //   "gray",
                    //   "#029F73",
                    //   "#5A9F8C",
                    //   "#5A9F8C"
                    // ]
                  },
                  "x": {"field": "start", "type": "genomic"},
                  "xe": {"field": "end", "type": "genomic"},
                  "size": {"value": 4},
                // //   "opacity": {"value": 0.8},
                //   "width": 600,
                //   "height": 150
                }
            // return {
            //     ...base,
            //     data: {
            //         url: EXAMPLE_DATASETS.multivec,
            //         type: 'multivec',
            //         row: 'sample',
            //         column: 'position',
            //         value: 'peak',
            //         categories: (Array.from(Array(i + 1).keys()).map(d => '' + d)),
            //         bin: 8
            //     },
            //     dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
            //     mark: 'bar',
            //     x: {
            //         field: 'start',
            //         type: 'genomic',
            //         domain,
            //         // axis,
            //         linkingID
            //     },
            //     xe: { field: 'end', type: 'genomic' },
            //     y: { field: 'peak', type: 'quantitative' },
            //     stroke: { value: 'white' },
            //     strokeWidth: { value: 0.3 },
            //     // the only difference between 'barchart'
            //     color: { field: 'peak', type: 'nominal' }
            // }
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
                    bin: 8
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
                    bin: 8
                },
                dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
                mark: 'point',
                x: {
                    field: 'position',
                    type: 'genomic',
                    // domain,
                    // axis,
                    // linkingID
                },
                y: { field: 'peak', type: 'quantitative' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: GET_SAMPLE_COLOR(i) }
            }
        case 'intervalBarchart':
            return {
                ...base,
                "data": {
                    "url": "https://server.gosling-lang.org/api/v1/tileset_info/?d=clinvar-beddb",
                    "type": "beddb",
                    "genomicFields": [
                      {"index": 1, "name": "start"},
                      {"index": 2, "name": "end"}
                    ],
                    "valueFields": [
                      {"index": 7, "name": "significance", "type": "nominal"}
                    ]
                  },
                    "mark": "bar",
                    "y": {
                        "field": "significance",
                        "type": "nominal",
                        "domain": [
                            "Pathogenic",
                            "Pathogenic/Likely_pathogenic",
                            "Likely_pathogenic",
                            "Uncertain_significance",
                            "Likely_benign",
                            "Benign/Likely_benign",
                            "Benign"
                        ],
                        // // "baseline": "Uncertain_significance",
                        // "range": [150, 20]
                    },
                    "size": {"value": 1},
                    "color": {"value": "lightgray"},
                    "stroke": {"value": "lightgray"},
                    "strokeWidth": {"value": 3},
                    "opacity": {"value": 0.3},
                
                //   "color": {
                //     "field": "significance",
                //     "type": "nominal",
                //     "domain": [
                //       "Pathogenic",
                //       "Pathogenic/Likely_pathogenic",
                //       "Likely_pathogenic",
                //       "Uncertain_significance",
                //       "Likely_benign",
                //       "Benign/Likely_benign",
                //       "Benign"
                //     ],
                //     "range": [
                //       "#CB3B8C",
                //       "#CB71A3",
                //       "#CB96B3",
                //       "gray",
                //       "#029F73",
                //       "#5A9F8C",
                //       "#5A9F8C"
                //     ]
                //   },
                  "x": {"field": "start", "type": "genomic"},
                  "xe": {"field": "end", "type": "genomic"},
                //   "size": {"value": 7},
                  "opacity": {"value": 0.8},
                //   "width": 600,
                //   "height": 150
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
                    bin: 8
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
                color: { value: GET_SAMPLE_COLOR(i) }
            }
        case 'intervalBarchartCN':
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
                        // {"field": "strand", "oneOf": ["+"]}
                      ]
                    },
                    "overlay": [
                    {
                        "mark": "rect", 
                        "xe": {"field": "end", "type": "genomic"}
                    },
                    {
                        "mark": "rect",
                        stroke: { value: "#7585FF"},
                        strokeWidth: { value: 3},
                    }
                    ],
                    "x": {"field": "start", "type": "genomic"},
                    // "size": {"value": 30},
                    "xe": {"field": "end", "type": "genomic"},
                "color": {
                    field: 'strand', type: 'nominal', domain: ['+', '-']
                //   "value": "#7585FF"
                },
                "opacity": {"value": 0.8}
              }
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
        case 'linechart':
        default:
            return {
                ...base,
                data: {
                    url: EXAMPLE_DATASETS.multivec,
                    type: 'multivec',
                    row: 'sample',
                    column: 'position',
                    value: 'peak',
                    categories: (Array.from(Array(i + 1).keys()).map(d => '' + d))
                },
                dataTransform: { filter: [ { field: 'sample', oneOf: [i + ''], not: false } ] },
                mark: 'line',
                x: {
                    field: 'position',
                    type: 'genomic',
                    // domain,
                    // axis,
                    // linkingID
                },
                y: { field: 'peak', type: 'quantitative' },
                color: { value: GET_SAMPLE_COLOR(i) }
            }
    }
}