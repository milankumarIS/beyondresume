import { Box, Tooltip } from "@mui/material";
import { useState } from "react";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/CustomRating.scss";

interface CustomRatingProps {
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  size?: string;
}

function CustomRating({
  value,
  onChange,
  icon,
  emptyIcon,
  size,
}: CustomRatingProps) {
  const [innerValue, setInnerValue] = useState(value);

  const checkIfIconInsideValue = (index: number) => value >= index + 1;

  const handleMouseHover = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.type === "mouseenter") {
      setInnerValue(index + 1);
    } else {
      setInnerValue(value);
    }
  };

  return (
    <Tooltip title={innerValue} placement="top">
      <Box className="custom-rating-main-div">
        {Array.from({ length: 5 }).map((_, index) => {
          const isFilled = checkIfIconInsideValue(index) || innerValue > index;
          return (
            <Box
              className={`custom-rating-icon-div ${isFilled ? "filled" : ""}`}
              key={index}
              onClick={() => onChange(index + 1)}
              onMouseEnter={(e) => handleMouseHover(e, index)}
              onMouseLeave={(e) => handleMouseHover(e, index)}
            >
              {isFilled
                ? icon || (
                    <FontAwesomeIcon icon={faStar} style={{ fontSize: size }} />
                  )
                : emptyIcon || (
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ fontSize: size, opacity: 0.3 }}
                    />
                  )}
            </Box>
          );
        })}
      </Box>
    </Tooltip>
  );
}

export default CustomRating;
