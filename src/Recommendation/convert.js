import get from 'lodash/get';
import { encodingToGoslingTrack } from './encoding';

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
        centerRadius: 0.3,
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

    // DEBUG
    // console.log('genoRec', genoRec);
    //

    const goslings = [];

    /**
     * This is the list of recommendations
     */
    Object.keys(genoRec).forEach((recommendation_n, i) => {
        console.log('<!--- NEW RECOMMENDATION INCOMING -->');
        const recommendationObj = genoRec[recommendation_n];
        const { arrangement } = recommendationObj;

        if(arrangement !== 'linearStacked' && arrangement !== 'circularStacked' ) {
            console.error('Unexpected arrangement', arrangement);
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
                const { 
                    layout, 
                    interconnection, 
                    availability, // ['continous', 'sparse'] Be aware the existing typo
                    granularity  // ['point', 'segment']
                } = trackGroup;


                // If circular, we use half width to prevent making the circular layout too large.
                // If comparing across multiple ROIs, use half width.
                const width = (compareMultipleRoi || layout === 'circular') ? baseWidth / 2.0 : baseWidth;

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
                                    Sequence_n,
                                    availability,
                                    granularity
                                ))),
                                layout: 'linear'
                            });
                            // gosling.arrangement.rowSizes.push(TRACK_HEIGHT_WITHOUT_AXIS);
                        }

                        const attribute = attributesObj[Attribute_n];
                        let { encoding } = attribute;

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

                        /// DEBUG
                        console.log(
                            recommendation_n, 
                            tasks.join(','), 
                            arrangement, 
                            trackAlignment, 
                            layout, 
                            groupingTechnique, 
                            encoding, 
                            availability, 
                            granularity
                        );
                        ///

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
                                Sequence_n,
                                availability,
                                granularity
                            ))),
                            overlayOnPreviousTrack
                        });

                        // Update titles when multiple tracks are superposed
                        if(overlayOnPreviousTrack && tracks.length - 2 >= 0) {
                            // When superposed, we need to have only one title, so concat them in the last track.
                            // tracks[tracks.length - 1].title = (
                            //     tracks[tracks.length - 2].title + ' + ' + tracks[tracks.length - 1].title
                            // );
                            // tracks[tracks.length - 2].title = undefined;
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
                                    availability,
                                    granularity
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

        // Finish creating a view by adding an adjacent view for comparison
        if(compareMultipleRoi) {
            GOS_VIEW = {
                ...getGosViewTemplate(),
                arrangement: 'horizontal',
                views: [
                    {...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain},
                    {...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain: xDomain2}
                ]
            }
        } else {
            GOS_VIEW = {...GOS_VIEW }
        }

        goslings.push(GOS_VIEW);
    }); // end of iteration on recommendations
    console.log('Final Goslings', goslings);
    return JSON.parse(JSON.stringify(goslings));
}