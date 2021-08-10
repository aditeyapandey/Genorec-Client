import { encodingToTrack } from "./encoding";
// import { getIdeogram } from "./ideogram";

// A flag variable to print log messages while debugging
const IS_DEBUG = true;

/**
 * Convert a Genorec recommendation spec into a list of Gosling.js specs.
 * 
 * @param {Array} geno A GenoREC output spec that contains multiple recommendation visualizations.
 * @param {number} width The size of recommended visualizations along a horizontal axis.
 * @returns {Array} An array of gosling specs.
 */
export function genorecToGosling(geno = [], width = 100) {
	if(IS_DEBUG) console.log("%cGenoREC Output Spec", "color: green; font-size: 18px", geno);

	const gos = [];
	geno.forEach(genoOption => {
		const { 
			viewPartition: partition, 
			viewArrangement: arrangement,
			viewConnectionType: connection,
			geneAnnotation,
			ideogramDisplayed: ideogram,
			views,
			tasks,
		} = genoOption;

		const gosViews = [];
		views.forEach(view => {
			const {
				trackAlignment: alignment,
				sequenceName: assembly,
				tracks
			} = view;

			const gosTracks = [];
			let index = 0;
			let layout = "linear";
			tracks.forEach(track => {
				const {
					layout: trackLayout,
					fileName,
					interconnectionType,
					encodings: subTracks
				} = track;

				layout = trackLayout;

				subTracks.forEach(subTrack => {
					const {
						encoding: encodingName,
						columnName: featureName
					} = subTrack;

					const title = `${fileName} - ${featureName}`;

					const gosTrack = encodingToTrack(encodingName, { title, width, index: index++ });
					if(partition === "segregated") {
						// In this case, we want to add multiple views each of which represent different chromosomes.
						for(let i = 0; i <= 5; i++) {
							gosViews.push({
								tracks: [{
									...JSON.parse(JSON.stringify(gosTrack)),
									width: width / 2.0 + width / 2.0 / (i + 1), // TODO: Need more accurate width considering the actual length.
									height: JSON.parse(JSON.stringify(gosTrack)).height / 2.0
								}],
								xDomain: { chromosome: `chr${i + 1}` }
							});	
						}
					} else {
						// Add a gosling track
						gosTracks.push(gosTrack);
					}
				});
			});

			if(partition === "segregated") {
				// !! We already added views for this case.
			} else {
				gosViews.push({
					layout,
					assembly,
					tracks: gosTracks
				});
			}
		});

		// Add a single gosling.js visualization
		gos.push({
			style: { enableSmoothPath: true },
			assembly: "hg38",
			arrangement: "vertical",
			centerRadius: 0.6,
			views: gosViews
		});
	});

	if(IS_DEBUG) console.log("%cConverted Gosling Spec", "color: blue; font-size: 18px", gos);
	return gos;
}