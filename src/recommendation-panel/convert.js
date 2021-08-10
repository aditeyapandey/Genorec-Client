import { SIMPLE_GOSLING_SPEC } from "./example";
// import get from "lodash/get";
// import { encodingToGoslingTrack } from "./encoding";
// import { getIdeogram } from "./ideogram";

// !!! Use the name of internal variables same as the actual object key, if possible.
// Generate a key to directly access to certain props.
// const GET_SEQUENCES_KEY = (recommendation_n) => `${recommendation_n}.visDetails`;
// const GET_TRACK_GROUPS_KEY = (recommendation_n, Sequence_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails`;
// const GET_TRACKS_KEY = (recommendation_n, Sequence_n, TrackGroup_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails`;
// const GET_ATTRIBUTES_KEY = (recommendation_n, Sequence_n, TrackGroup_n, Track_n) => `${recommendation_n}.visDetails.${Sequence_n}.visDetails.${TrackGroup_n}.visDetails.${Track_n}.visDetails`;

// const getGosViewTemplate = () => {
// 	return {
// 		assembly: "hg38",
// 		arrangement: "vertical",
// 		centerRadius: 0.5,
// 		views: []
// 	};
// };

/**
 * Convert a Genorec recommendation spec into a list of Gosling.js specs.
 * 
 * @param {Object} geno The GenoREC spec that contains multiple visualizations that are suggested by GenoREC Engine.
 * @param {number} width The size of recommended visualizations along a horizontal axis.
 * @returns {Array} An array of gosling specs.
 */
export function genorecToGosling(
	geno, 
	width
) {
	// DEBUG
	console.log(`%cGenoREC: ${geno}`, "color: green");

	if(Object.keys(geno).length === 0) {
		// We did not receive any recommendation, so no point to convert.
		return [];
	}

	return [
		SIMPLE_GOSLING_SPEC(width, "linear"), 
		SIMPLE_GOSLING_SPEC(width, "circular")
	];

	/* Below codes are deprecated */
	// if (!genorec) {
	// 	// Recommendation spec is not ready.
	// 	return [];
	// }

	// /* TASKS */
	// // Possible elements: singleroi, multipleroi, multipleattributes, multiplefeatures, multiplesequences, overview
	// const tasks = JSON.parse(JSON.stringify(genorec)).tasks;

	// const hasSingleRoi = tasks && tasks.includes("singleroi");
	// const compareMultipleRoi = tasks && tasks.includes("multipleroi");
	// const compareMultipleAttr = tasks && (tasks.includes("multipleattributes") || tasks.includes("multiplefeatures"));

	// let xDomain = undefined, xDomain2 = undefined;
	// if (hasSingleRoi || compareMultipleRoi) {
	// 	// This means we have at least one local ROI to show.
	// 	xDomain = { chromosome: "8" }; //, interval: [127636068, 127741434]};
	// }

	// if (compareMultipleRoi) {
	// 	// This means we will compare multiple, here two, regions.
	// 	xDomain2 = { chromosome: "12" }; //, interval: [6445000, 6585000]};
	// }

	// // For the convenience, remove tasks and have only `recommendation_*`
	// delete genorec.tasks;

	// // DEBUG
	// // console.log('genoRec', genoRec);
	// //

	// const goslings = [];
	// let globalLayout = "linear"; // if anything is circular, then circular.

	// /**
	//  * This is the list of recommendations
	//  */
	// Object.keys(genorec).forEach((recommendation_n, i) => {
	// 	console.log("<!--- NEW RECOMMENDATION INCOMING -->");
	// 	const recommendationObj = genorec[recommendation_n];
	// 	const { arrangement } = recommendationObj;

	// 	let notSupportedArrangement = false;
	// 	let isCircularAdjacent = false;
	// 	let isLinearOrthogoal = false;
	// 	if (arrangement !== "linearStacked" && arrangement !== "circularStacked") {
	// 		notSupportedArrangement = true;
	// 		isCircularAdjacent = (arrangement === "circularAdjacent");
	// 		isLinearOrthogoal = arrangement === "linearOrthogonal";
	// 		console.error("Unexpected arrangement", arrangement);
	// 	}

	// 	/**
	//      * Incoming View
	//      */
	// 	let GOS_VIEW = {
	// 		...getGosViewTemplate(),
	// 		xDomain
	// 	};

	// 	/* Collection of Sequence_ */
	// 	const sequencesKey = GET_SEQUENCES_KEY(recommendation_n);
	// 	const sequencesObj = get(genorec, sequencesKey);

	// 	// divide size
	// 	// gosling.arrangement.columnSizes /= Object.keys(sequencesObj).length;

	// 	let numOfTracks = 0;
	// 	Object.keys(sequencesObj).forEach(Sequence_n => {
	// 		const sequenceObj = sequencesObj[Sequence_n];
	// 		const { trackAlignment, sequenceName } = sequenceObj;

	// 		/**
	//          * Group of tracks, i.e., view
	//          */
	// 		let tracks = [];
	// 		let viewLayout = null;

	// 		/* Collection of TrackGroup_ */
	// 		const trackGroupsKey = GET_TRACK_GROUPS_KEY(recommendation_n, Sequence_n);
	// 		const trackGroupsObj = get(genorec, trackGroupsKey);
	// 		Object.keys(trackGroupsObj).forEach(trackGroup_n => {
	// 			const trackGroup = trackGroupsObj[trackGroup_n];
	// 			const {
	// 				layout,
	// 				interconnection,
	// 				availability, // ['continous', 'sparse'] Be aware the existing typo
	// 				granularity  // ['point', 'segment']
	// 			} = trackGroup;

	// 			if (layout === "circular") {
	// 				globalLayout = "circular";
	// 			}

	// 			// If circular, we use half width to prevent making the circular layout too large.
	// 			// If comparing across multiple ROIs, use half width.
	// 			let width = (compareMultipleRoi || layout === "circular") ? width / 2.0 : width;
	// 			if (arrangement === "circularAdjacent") {
	// 				width /= 2.0;
	// 			}

	// 			if (!viewLayout) {
	// 				viewLayout = layout;
	// 			} else if (viewLayout !== layout) {
	// 				console.error("layout is different across tracks");
	// 			}

	// 			/* Collection of Track_ */
	// 			const tracksKey = GET_TRACKS_KEY(recommendation_n, Sequence_n, trackGroup_n);
	// 			const tracksObj = get(genorec, tracksKey);
	// 			Object.keys(tracksObj).forEach((Track_n, Track_i) => {
	// 				const track = tracksObj[Track_n];
	// 				const { groupingTechnique } = track; // typeof 'superposed' | 'combined' | 'none'

	// 				/* Collection of Attribute_ */
	// 				const attributesKey = GET_ATTRIBUTES_KEY(recommendation_n, Sequence_n, trackGroup_n, Track_n);
	// 				const attributesObj = get(genorec, attributesKey);

	// 				Object.keys(attributesObj).forEach((Attribute_n, Attribute_i) => {
	// 					if (groupingTechnique === "combined" && Attribute_i !== 0) {
	// 						// We only add a single track when multiple attributes are encoded together, so let's get out of this scrope.
	// 						return;
	// 					}

	// 					const attribute = attributesObj[Attribute_n];
	// 					let { encoding } = attribute;

	// 					if (groupingTechnique === "combined") {
	// 						// If combined, we get the second encoding
	// 						// NOTE: Only two `encoding` can be combined in the GenoRec output
	// 						if (Object.keys(attributesObj).length <= Attribute_i + 1) {
	// 							// We did not find the second one.
	// 							console.warn("Output file format is incorrect. Two attributes should be provided for a `combined` grouping technique.");
	// 						} else {
	// 							// Let's combine the two
	// 							const nextAttribute = attributesObj[Object.keys(attributesObj)[Attribute_i + 1]];
	// 							// if `heatmap` and `barchartCN` is combined, it will look like "barchartCN.heatmap"
	// 							encoding = [encoding, nextAttribute.encoding].sort().join(".");
	// 						}
	// 					}

	// 					/// DEBUG
	// 					console.log(
	// 						recommendation_n,
	// 						tasks.join(","),
	// 						arrangement,
	// 						trackAlignment,
	// 						layout,
	// 						groupingTechnique,
	// 						encoding,
	// 						availability,
	// 						granularity
	// 					);
	// 					///

	// 					const isAxisShown = Track_i === Object.keys(tracksObj).length - 1;
	// 					const overlayOnPreviousTrack = (
	// 						(trackAlignment === "superimposed") ||
	//                         (groupingTechnique === "superposed" && Attribute_i !== 0)
	//                         //  ||  (layout === 'circular' && Track_i !== 0)
	// 					);

	// 					// Title of track
	// 					const title = `${trackGroup_n}.${Track_n}.${Attribute_n}`;

	// 					// Matrix view is not supported at all.
	// 					if (!notSupportedArrangement || true) {
	// 						// Add a single Gosling track
	// 						tracks.push({
	// 							...JSON.parse(JSON.stringify(encodingToGoslingTrack(
	// 								encoding,
	// 								width,
	// 								numOfTracks++,
	// 								isAxisShown,
	// 								// show title only on the first track
	// 								sequenceName,
	// 								Sequence_n,
	// 								availability,
	// 								granularity,
	// 								overlayOnPreviousTrack ? numOfTracks++ : 0,
	// 							))),
	// 							overlayOnPreviousTrack
	// 						});
	// 					}
	// 				});

	// 				// At the end, add a connection track if needed.
	// 				const isLastTrack = Track_i === Object.keys(tracksObj).length - 1;
	// 				if (isLastTrack && interconnection) {
	// 					tracks.push({
	// 						...JSON.parse(JSON.stringify(encodingToGoslingTrack(
	// 							"link",
	// 							width,
	// 							numOfTracks++,
	// 							false,
	// 							// show title only on the first track
	// 							undefined,
	// 							Sequence_n,
	// 							availability,
	// 							granularity
	// 						)))
	// 					});
	// 				}
	// 			});
	// 		});
	// 		// console.log(GOS_VIEW, tracks);

	// 		GOS_VIEW.views.push({
	// 			layout: viewLayout,
	// 			spacing: 1,
	// 			tracks
	// 		});
	// 	});

	// 	// fine-tune the center radius
	// 	// GOS_VIEW.centerRadius = Math.max(0.2, 0.6 - GOS_VIEW.views.length * 0.1);

	// 	if (arrangement === "linearOrthogonal") {
	// 		GOS_VIEW.views.push({
	// 			layout: "linear",
	// 			spacing: 1,
	// 			tracks: [{
	// 				...JSON.parse(JSON.stringify(encodingToGoslingTrack(
	// 					"matrix",
	// 					width / 2.0,
	// 					0,
	// 					false
	// 				)))
	// 			}]
	// 		});
	// 	}

	// 	// console.log('gosling', GOS_VIEW);

	// 	// Put a link at the end
	// 	GOS_VIEW.views.forEach(v => {
	// 		if (v.tracks.find(d => d.mark === "link")) {
	// 			// Put links at the end
	// 			v.tracks = [
	// 				...v.tracks.filter(d => d.mark !== "link"),
	// 				v.tracks.find(d => d.mark === "link")
	// 			];
	// 		}
	// 	});

	// 	// Finish creating a view by adding an adjacent view for comparison
	// 	if (notSupportedArrangement && false) {
	// 		// If this is a not support track, show a message
	// 		// GOS_VIEW.views = [{
	// 		//     tracks: [{
	// 		//         ...JSON.parse(JSON.stringify(encodingToGoslingTrack(
	// 		//             arrangement === 'circularAdjacent' ? 
	// 		//             'Line connection between two views' :
	// 		//             'Matrix view' , 
	// 		//             baseWidth / 2.0,
	// 		//         )))
	// 		//     }]
	// 		// }];
	// 	}
	// 	else {
	// 		if (!compareMultipleAttr && !compareMultipleRoi && !hasSingleRoi) {
	// 			GOS_VIEW = {
	// 				...getGosViewTemplate(),
	// 				...JSON.parse(JSON.stringify(GOS_VIEW)),
	// 				arrangement: "vertical",
	// 				spacing: 90,
	// 				views: GOS_VIEW.views.map(view => {
	// 					return {
	// 						...view,
	// 						arrangement: "vertical",
	// 						spacing: 1,
	// 						tracks: undefined,
	// 						views: view.tracks.map((track, i) => {
	// 							return {
	// 								spacing: 1,
	// 								tracks: [{
	// 									...track,
	// 									// x: { ...track.x, axis: (i === 0 || globalLayout === 'circular') ? 'top' : 'none'}
	// 								}]
	// 							};
	// 						})
	// 					};
	// 				})
	// 			};
	// 		}

	// 		if (arrangement === "circularAdjacent") {
	// 			GOS_VIEW = {
	// 				...GOS_VIEW,
	// 				spacing: 1,
	// 				arrangement: "serial",

	// 			};
	// 		}

	// 		if (hasSingleRoi) {
	// 			GOS_VIEW = {
	// 				...getGosViewTemplate(),
	// 				arrangement: "parallel",
	// 				views: [
	// 					{ ...JSON.parse(JSON.stringify(getIdeogram("A", "B", width))) },
	// 					{
	// 						arrangement: "horizontal",
	// 						spacing: 30,
	// 						views: [
	// 							{ ...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain, xLinkingId: "A" },
	// 						]
	// 					}
	// 				]
	// 			};
	// 		} else if (compareMultipleRoi) {
	// 			GOS_VIEW = {
	// 				...getGosViewTemplate(),
	// 				arrangement: "parallel",
	// 				views: [
	// 					{ ...JSON.parse(JSON.stringify(getIdeogram("A", "B", width + 30))) },
	// 					{
	// 						arrangement: "horizontal",
	// 						spacing: 30,
	// 						views: [
	// 							{ ...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain, xLinkingId: "A" },
	// 							{ ...JSON.parse(JSON.stringify(GOS_VIEW)), xDomain: xDomain2, xLinkingId: "B" }
	// 						]
	// 					}
	// 				]
	// 			};
	// 		}
	// 	}

	// 	goslings.push(GOS_VIEW);
	// }); // end of iteration on recommendations
	// console.log("Final Goslings", goslings);
	// return JSON.parse(JSON.stringify(goslings));
}