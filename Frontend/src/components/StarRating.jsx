import React, { useState } from "react";

const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  maxStars = 5,
  size = "text-xl",
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const activeValue = hoverValue || value;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= activeValue;

        return (
          <button
            key={starRating}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(starRating)}
            onMouseEnter={() => handleMouseEnter(starRating)}
            onMouseLeave={handleMouseLeave}
            className={`${size} ${
              readOnly ? "cursor-default" : "cursor-pointer"
            } ${
              isFilled ? "text-yellow-500 font-bold" : "text-gray-300"
            } focus:outline-none transition-colors`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
