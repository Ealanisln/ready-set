export const MaskBackground = () => {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0">
      <div className="h-40 w-full bg-gradient-to-t from-white to-transparent" />
      <div className="h-20 w-full bg-white" />
    </div>
  );
};