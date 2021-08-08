import React, { useState, useEffect, useMemo } from "react";
import { GoslingComponent } from "gosling.js";
import { genorecToGosling } from "./convert";
import { v1 } from 'uuid';
import "./recommendation-panel.css";

const RecommendationPanel = React.memo((props) => {
  const {
    data: genorec, // final specs
    _data: _genorecForDev, // specs for development which allows not to click on a button everytime
    width
  } = props;

  return (
    <div className="gosling-recommendation-output">
      {/* TODO: Use `genorec` instead for the deployment */}
      {genorecToGosling(JSON.parse(JSON.stringify(_genorecForDev)), width - 40 /* padding */ + 1).map((spec, i) => {
        return i < 10 ?
          <>
            <div className="w3-center w3-light-grey w3-padding recommendation-header">
              <div className="w3-row">
              <div className="w3-col s9 w3-center"><h5>{`Option ${parseInt(i + 1)}`}</h5></div>
              <div className="w3-col s3 w3-center">
                <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({'YOURJSON':7}))}`} download="filename.json" className="w3-button w3-dark-gray w3-theme" >Export Gosling Spec <i className="fa fa-external-link"></i></a>
              </div>
               </div>
            </div>
            <GoslingComponent
              key={v1()}
              className={'gosling-component'}
              spec={spec}
              padding={20}
              outline={'1px solid gray'}
              theme={'light'}
            />
          </> : null
      })}
    </div>
  );
});

export default RecommendationPanel;
