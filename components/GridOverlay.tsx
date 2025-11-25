"use client";

const GridOverlay = () => {
  return (
    <div className="absolute inset-0 hidden md:block  bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>
  );
};

export default GridOverlay;
