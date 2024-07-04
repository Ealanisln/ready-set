import React from "react";

interface CirclePatternProps {
  className?: string;
}

const CirclePattern: React.FC<CirclePatternProps> = ({ className }) => {
  const renderCircles = (numCircles: number, offsetX: number, offsetY: number, cols: number) =>
    [...Array(numCircles)].map((_, index) => (
      <circle
        key={index}
        cx={offsetX + index % cols * 12.3}
        cy={offsetY - Math.floor(index / cols) * 12.3}
        r="1.39737"
        transform={`rotate(-90 ${offsetX + index % cols * 12.3} ${offsetY - Math.floor(index / cols) * 12.3})`}
        fill="#3056D3"
      />
    ));

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {renderCircles(16, 1.39737, 38.6026, 4)}
    </svg>
  );
};

export default CirclePattern;
