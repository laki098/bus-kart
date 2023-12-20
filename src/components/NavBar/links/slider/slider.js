import { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import "./sliderstyles.css";

const Slider = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentValue(value);
    // Automatsko prepoznavanje stranice (1/2 ili 2/2) na osnovu vrednosti slidera
    setCurrentPage(value <= 50 ? 1 : 2);
  }, [value]);

  const handleSliderChange = (newValue) => {
    setCurrentValue(newValue);
    // Automatsko prepoznavanje stranice (1/2 ili 2/2) na osnovu nove vrednosti slidera
    setCurrentPage(newValue <= 50 ? 1 : 2);
  };

  const color = currentValue <= 33 ? "#99d805" : "#46f146";

  return (
    <div className="slider-container">
      {/* Prikaz trenutne stranice */}
      <div className="current-page-text">{`Korak ${currentPage}/2`}</div>
      <div className="slider-wrapper">
        <ReactSlider
          thumbClassName="customSlider-thumb"
          trackClassName="customSlider-track"
          value={currentValue}
          onChange={handleSliderChange}
          disabled
        />
        <div className="customSlider-progress-bar" style={{ width: `${currentValue}%`, background: color }}></div>
      </div>
    </div>
  );
};

export default Slider;