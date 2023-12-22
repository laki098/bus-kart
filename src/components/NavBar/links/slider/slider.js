import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import "./sliderstyles.css";

const Slider = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentValue(value);
    setCurrentPage(value <= 50 ? 1 : 2);
  }, [value]);
  
  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        <ReactSlider
          thumbClassName="customSlider-thumb"
          trackClassName="customSlider-track"
          value={currentValue}
          disabled
        />
        <div className="customSlider-progress-bar">
        <div className={`page-number ${currentPage === 1 || currentPage === 2 ? 'active' : ''} ${currentPage === 1 ? 'right-skew' : ''}`}>1</div>
          <div className={`page-number ${currentPage === 2 ? 'active' : ''}`}>2</div>
        </div>
      </div>
    </div>
  );
};

export default Slider;