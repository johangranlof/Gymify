import React from 'react';
import './Slider.css';

const Slider = ({ value, onChange }) => {
    return (
        <div className="slider-container">
            <input
                type="range"
                min="0"
                max="180"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="slider"
            />
            <div className="slider-value">{value} minutes</div>
        </div>
    );
};

export default Slider;
