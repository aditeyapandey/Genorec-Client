import get from 'lodash/get';

// !!! Use the name of internal variables same as the actual object key, if possible.
// Generate a key to directly access to certain props.
const GET_SEQUENCES_KEY = (recommendation_n) => `${recommendation_n}.visDetails`;
const GET_TRACK_GROUPS_KEY = (recommendation_n, Sequence_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails`;
const GET_TRACKS_KEY = (recommendation_n, Sequence_n, TrackGroup_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails`;
const GET_ATTRIBUTES_KSY = (recommendation_n, Sequence_n, TrackGroup_n, Track_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails.${Track_n}.visDetails`;

/**
 * Convert a GenoRec recommendation spec to a list of Gosling specs.
 * @param {Object} genoRec Output description of GenoRec.
 * @returns {Array} An array of gosling specs.
 */
export function convert(genoRec, width, maxRec){
    // Tasks
    const tasks = JSON.parse(JSON.stringify(genoRec)).tasks;

    // For the convenience, remove tasks and have only `recommendation_*`
    delete genoRec.tasks;

    if(!genoRec) {
        // Recommendation spec is not ready.
        return [];
    }

    // DEBUG
    console.log('genoRec', genoRec);
    //

    const goslings = [];
    
    /**
     * This is the list of recommendations
     */
    Object.keys(genoRec).forEach(recommendation_n => {
        console.log('New Recommendation Processing...');
        const recommendationObj = genoRec[recommendation_n];
        const { arrangement } = recommendationObj;
        console.log('arrangement'.toUpperCase(), arrangement);

        // incoming gosling spec
        const gosling = {
            assembly: 'hg38',
            // // !!! We need to revisit this so that right arrangement is decided
            // arrangement: {
            //     // !!! Temporally, we are placing multiple sequences side-by-side horizontally
            //     direction: 'vertical',
            //     // !!! Parameterize the size of a view
            //     columnSizes: 401,
            //     rowSizes: [],
            //     rowGaps: 0
            //     // wrap: ?
            // },
            arrangement: 'vertical',
            title: recommendation_n,
            views: []
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
            console.log('trackAlignment'.toUpperCase(), trackAlignment);

            /* Collection of TrackGroup_ */
            const trackGroupsKey = GET_TRACK_GROUPS_KEY(recommendation_n, Sequence_n);
            const trackGroupsObj = get(genoRec, trackGroupsKey);
            Object.keys(trackGroupsObj).forEach(trackGroup_n => {
                const trackGroup = trackGroupsObj[trackGroup_n];
                const { layout, interconnection } = trackGroup;
                console.log('layout'.toUpperCase(), layout);
                
                /**
                 * Group of tracks, i.e., view
                 */
                const tracks = [];

                let outerRadius = TRACK_HEIGHT_CIRCULAR / 2.0;

                /* Collection of Track_ */
                const tracksKey = GET_TRACKS_KEY(recommendation_n, Sequence_n, trackGroup_n);
                const tracksObj = get(genoRec, tracksKey);
                Object.keys(tracksObj).forEach((Track_n, Track_i) => {
                    const track = tracksObj[Track_n];
                    const { groupingTechnique } = track; // typeof 'superposed' | 'combined' | 'none'
                    console.log('groupingTechnique'.toUpperCase(), groupingTechnique);

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
                        console.log('encoding'.toUpperCase, encoding);

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
                                
                                // DEBUG
                                console.log(encoding);
                                ///
                            }
                        }

                        const isAxisShown = Track_i === Object.keys(tracksObj).length - 1;
                        const overlayOnPreviousTrack = (
                            (groupingTechnique === 'superposed' && Attribute_i !== 0) || 
                            (layout === 'circular' && Track_i !== 0)
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
                            layout,
                            outerRadius,
                            innerRadius: outerRadius - ringSize,
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

                        if(layout === 'circular') {
                            outerRadius -= (ringSize + 4 /* small gap */);
                        }

                        if(interconnection && layout === 'circular' && Track_i === Object.keys(tracksObj).length - 1) {
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
                                layout: 'circular',
                                outerRadius,
                                innerRadius: 0,
                                overlayOnPreviousTrack
                            });
                        }
                    });
                });

                gosling.views.push({
                    tracks
                });
            });
        });
        console.log('gosling', gosling);
        goslings.push(gosling);
    }); // end of iteration on recommendations
    console.log('goslings', goslings);
    return goslings;
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
                data: {
                  url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
                  type: "csv",
                  chromosomeField: "c2",
                  genomicFields: ["s1", "e1", "s2", "e2"]
                },
                superpose: [
                  {
                    mark: "link",
                    x: {
                      field: "s1",
                      type: "genomic",
                      domain,
                    //   axis,
                      linkingID
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
                data: {
                    url: "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/circos-segdup-edited.txt",
                    type: "csv",
                    chromosomeField: "c2",
                    genomicFields: ["s1", "e1", "s2", "e2"]
                  },
                  superpose: [
                    {
                      mark: "link",
                      x: {
                        field: "s1",
                        type: "genomic",
                        domain,
                        // axis,
                        linkingID
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
                    domain,
                    // axis,
                    linkingID
                },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                // the only difference between 'barchart'
                color: { field: 'peak', type: 'nominal' }
            }
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
                    domain,
                    // axis,
                    linkingID
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
                    domain,
                    // axis,
                    linkingID
                },
                y: { field: 'peak', type: 'quantitative' },
                size: { value: 4 },
                opacity: { value: 0.8 },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: GET_SAMPLE_COLOR(i) }
            }
        case 'intervalBarchart':
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
                    domain,
                    // axis,
                    linkingID
                },
                xe: { field: 'end', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative' },
                stroke: { value: 'white' },
                strokeWidth: { value: 0.3 },
                color: { value: GET_SAMPLE_COLOR(i) }
            }
        case 'intervalBarchartCN':
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
                    domain,
                    // axis,
                    linkingID
                },
                xe: {field: "chromEnd", type: "genomic"},
                stroke: {value: "lightgray"},
                strokeWidth: {value: 0.5},
                outerRadius: 264,
                innerRadius: 244,
                superposeOnPreviousTrack: true
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
                    domain,
                    // axis,
                    linkingID
                },
                y: { field: 'peak', type: 'quantitative' },
                color: { value: GET_SAMPLE_COLOR(i) }
            }
    }
}