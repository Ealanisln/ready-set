import React from 'react';

interface CirclePatternProps {
  className?: string;
  numCircles: number;
  offsetX: number;
  offsetY: number;
  cols: number;
  width: number;
  height: number;
  viewBox: string;
}

const CirclePatternSecond: React.FC<CirclePatternProps> = ({
  className,
  numCircles,
  offsetX,
  offsetY,
  cols,
  width,
  height,
  viewBox
}) => {
  const renderCircles = () =>
    [...Array(numCircles)].map((_, index) => (
      <circle
        key={index}
        cx={offsetX + (index % cols) * 12.3}
        cy={offsetY - Math.floor(index / cols) * 12.3}
        r="1.39737"
        transform={`rotate(-90 ${offsetX +
          (index % cols) * 12.3} ${offsetY -
          Math.floor(index / cols) * 12.3})`}
        fill="#3056D3"
      />
    ));

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {renderCircles()}
    </svg>
  );
};

export default CirclePatternSecond;
