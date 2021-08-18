import React, { useEffect, useMemo, useState } from "react";
import { GoslingComponent } from "gosling.js";
import { genorecToGosling, IS_DEBUG_RECOMMENDATION_PANEL } from "./convert";
// import exampleSpecs from "./examples";
import "./index.css";

function RecommendationPanel(props) {
	const {
		data: initGenoRec, // final specs
		_data: initGenoRecDev, // specs for development which allows not to click on a button everytime
		width
	} = props;

	const [genorecSpec, setGenorecSpec] = useState(IS_DEBUG_RECOMMENDATION_PANEL ? initGenoRecDev : initGenoRec);

	useEffect(() => {
		if(IS_DEBUG_RECOMMENDATION_PANEL) {
			setGenorecSpec(initGenoRecDev);
		}
	}, [initGenoRecDev]);

	useEffect(() => {
		if(!IS_DEBUG_RECOMMENDATION_PANEL) {
			setGenorecSpec(initGenoRec);
		}
	}, [initGenoRec]);

	const recommendationOptions = useMemo(() => {
		return (
			genorecToGosling(JSON.parse(JSON.stringify(genorecSpec)), width - 40).map((spec, i) => {
				return i < 10 ?
					<div key={JSON.stringify(spec)}>
						<div className="w3-center w3-light-grey w3-padding recommendation-header">
							<div className="w3-row">
								<div className="w3-col s9 w3-center"><h5>{`Option ${parseInt(i + 1)}`}</h5></div>
								<div className="w3-col s3 w3-center">
									<a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(spec))}`} download="gosling-spec.json" className="w3-button w3-block w3-dark-gray w3-theme" > <i className="fa fa-external-link"></i> Export </a>
								</div>
							</div>
						</div>
						<GoslingComponent
							className={"gosling-component"}
							spec={spec}
							padding={20}
							outline={"1px solid gray"}
							theme={"light"}
						/>
					</div> : null;
			})
		)
	}, [genorecSpec]);

	return (
		<div className="gosling-recommendation-output">
			{recommendationOptions}
		</div>
	);
}

export default RecommendationPanel;
