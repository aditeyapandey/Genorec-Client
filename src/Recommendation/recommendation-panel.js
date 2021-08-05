import React, { useState, useEffect, useMemo } from "react";
import { GoslingComponent } from "gosling.js";
import { genorecToGosling } from "./convert";
import { v1 } from 'uuid';
import "./recommendation-panel.css";

const RecommendationPanel = React.memo((props) => {
  const {
    data: genorec,
    width
  } = props;

  return (
    <div className="gosling-recommendation-output">
      {genorecToGosling(JSON.parse(JSON.stringify(genorec)), width).map((spec, i) => {
        return i < 10 ?
          <>
            <div className="w3-center w3-light-grey w3-padding">
              <h5>{`Option ${parseInt(i + 1)}`}</h5>
            </div>
            <GoslingComponent
              key={v1()}
              spec={spec}
              padding={0} />
          </> : null
      })}
    </div>
  );
});

export default RecommendationPanel;
