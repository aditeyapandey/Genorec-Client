import { encodingToTrack } from "./encoding";
import { getGeneAnnotation } from "./gene-annotation";
import { getIdeogram, getOverview } from "./ideogram";
// import { getIdeogram } from "./ideogram";

// A flag variable to print log messages while debugging
export const IS_DEBUG = false;

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
			// ideogramDisplayed: ideogram,
			views,
			tasks: task, // One of 'singleROI', 'compareMultipleROI', and 'overview'
		} = genoOption;

		if(arrangement !== "stack" && arrangement !== "orthogonal") {
			if(IS_DEBUG) console.log(`%c Unsupported arrangement: ${arrangement}`, "color: orange; font-size: 24px");
		}
		if(connection === "dense") {
			//
		} else if(connection === "none") {
			// We do nothing for this.
		} else {
			if(IS_DEBUG) console.log(`%c Unsupported view connection: ${connection}`, "color: orange; font-size: 24px");
		}

		const gosViews = [];

		if(connection === "dense" && arrangement === "orthogonal") {
			// we want to add a matrix
			gosViews.push({
				// assembly, // we do not have this information, lets use a default one
				// xOffset: width / 2.0,
				tracks: [
					encodingToTrack("matrix", { 
						title: "matrix", 
						width
					})
				]
			});
		}

		views.forEach(view => {
			const {
				trackAlignment: alignment,
				sequenceName: assembly,
				tracks
			} = view;

			if(alignment !== "stack") {
				if(IS_DEBUG) console.log(`%c Unsupported alignment: ${alignment}`, "color: orange; font-size: 24px");
			}

			const gosTracks = [];
			let trackCount = 0;
			let layout = "linear"; // don't know why this is specified in the tracks, but have another version here in the view level.
			let isSparseInterconnectionCircularLayout = false;
			tracks.forEach(track => {
				const {
					layout: trackLayout,
					fileName,
					interconnectionType: interconnection, // One of "sparse" and ?
					encodings: subTracks
				} = track;
				
				layout = trackLayout;

				if(interconnection === "sparse") {
					// We need to add a arc track for interconnection
					if(layout === "linear") {
						gosTracks.push(
							encodingToTrack("link", { 
								title: "arc", 
								width
							})
						);
					} else {
						// for circular, we add the track later
						isSparseInterconnectionCircularLayout = true;
					}
				} else if (interconnection === "none"){
					// We do nothing for this.
				} else {
					if(IS_DEBUG) console.log(`%c Unsupported interconnection: ${interconnection}`, "color: orange; font-size: 24px");
				}

				subTracks.forEach(subTrack => {
					const {
						encoding: encodingName,
						columnName: featureName
					} = subTrack;

					const title = `${fileName} - ${featureName}`;

					// Create a gosling track specification
					const gosTrack = encodingToTrack(
						encodingName, 
						{ 
							title, 
							width, 
							index: trackCount++ 
						}
					);
					
					let gosArcTrack;

					if(partition === "segregated") {
						// In this case, we want to add multiple views each of which represent different chromosomes.
						for(let i = 0; i <= 5; i++) {
							const adjustedGosTrack = {
								...JSON.parse(JSON.stringify(gosTrack)),
								width: width / 2.0 + width / 2.0 / (i + 1), // TODO: Need more accurate width considering the actual length.
								height: JSON.parse(JSON.stringify(gosTrack)).height / 2.0
							};
							gosViews.push({
								tracks: (
									geneAnnotation ? 
										[{ ...getGeneAnnotation(width, 50), width: adjustedGosTrack.width}, adjustedGosTrack] :
										[adjustedGosTrack]
								),
								xDomain: { chromosome: `chr${i + 1}` }
							});	
						}
					} else {
						// Add a gosling track
						if(gosArcTrack) {
							// Add arc first
						}
						gosTracks.push(gosTrack);
					}
				});
			});

			if(isSparseInterconnectionCircularLayout) {
				// We need to add a arc track for interconnection
				gosTracks.push(
					encodingToTrack("link", { 
						title: "arc", 
						width
					})
				);
			}
			
			if(partition === "segregated") {
				// !! We already added views for this case.
			} else {
				if(task?.toLowerCase() === "singleroi" || task?.toLowerCase() === "comparemultipleroi") {
					// Add an ideogram overview
					gosViews.push({
						layout: "linear",
						assembly,
						tracks: [getOverview(width, 20)]
					});
					
					if(task?.toLowerCase() === "singleroi") {
						// Zoom to show local regions
						gosViews.push({
							layout,
							assembly,
							xDomain: { chromosome: "3" },
							linkingId: "A",
							tracks: (
								geneAnnotation ? 
									[getGeneAnnotation(width, 100), ...gosTracks] :
									gosTracks
							)
						});						
					} else if(task?.toLowerCase() === "comparemultipleroi") {
						// Zoom to show local regions with two views
						// In this case, we need to add two views juxtaposed.
						const spacing = 20;
						const viewWidth = width / 2.0 - spacing / 2.0;
						gosViews.push({
							arrangement: "horizontal",
							spacing,
							views: [
								{
									layout,
									assembly,
									xDomain: { chromosome: "3" },
									linkingId: "A",
									tracks: (
										geneAnnotation ? 
											[
												getIdeogram(viewWidth, 20),
												getGeneAnnotation(viewWidth, 100), 
												...gosTracks.map(d => { return {...d, width: viewWidth };} )
											] :
											gosTracks.map(d => { return {...d, width: viewWidth };} )
									)
								},
								{
									layout,
									assembly,
									xDomain: { chromosome: "6" },
									linkingId: "B",
									tracks: (
										geneAnnotation ? 
											[
												getIdeogram(viewWidth, 20),
												getGeneAnnotation(viewWidth, 100), 
												...gosTracks.map(d => { return {...d, width: viewWidth };} )
											] :
											gosTracks.map(d => { return {...d, width: viewWidth };} )
									)
								}
							]
						});						
					}
				} else {
					// This means an overview task is selected.
					gosViews.push({
						layout,
						assembly,
						tracks: (
							geneAnnotation ? 
								[getGeneAnnotation(width, 100), ...gosTracks] :
								gosTracks
						)
					});
				}
			}
		});

		// Add a single gosling.js visualization
		gos.push({
			style: { enableSmoothPath: true },
			assembly: "hg38",
			arrangement: "vertical",
			centerRadius: 0.3,
			views: gosViews
		});
	});

	if(IS_DEBUG) console.log("%cConverted Gosling Spec", "color: blue; font-size: 18px", gos);
	return gos;
}