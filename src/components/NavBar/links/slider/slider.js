import { useState, useEffect } from "react";
import ReactSlider from "react-slider";
import "./sliderstyles.css";

const Slider = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSliderChange = (newValue) => {
    setCurrentValue(newValue);
  };

  const color = currentValue <= 33 ? "#99d805" : "#46f146";

  return (
    <div className="slider-container">
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