const Decoratives = () => {
  return (
    <div>
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-[25%] left-1/2 w-[600px] h-[600px] bg-gray-700 rounded-full blur-[120px] animate-pulse
               -translate-x-1/2 -translate-y-1/2"
          style={{
            transition: "transform 0.5s ease-out",
            animationDelay: "1.5s",
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]  pointer-events-none"></div>

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black  pointer-events-none"></div>
    </div>
  );
};

export default Decoratives;
