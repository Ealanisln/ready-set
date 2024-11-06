export const MaskBackground = () => {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 w-full">
      <svg
        className="w-full h-auto"
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 140H1440V40C1440 40 1320 140 720 140C120 140 0 40 0 40V140Z"
          fill="white"
        />
      </svg>
      <div className="h-20 w-full bg-white" />
    </div>
  );
};

export default MaskBackground;