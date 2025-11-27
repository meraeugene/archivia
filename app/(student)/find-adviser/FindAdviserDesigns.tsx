"use client";

const FindAdviserDesigns = () => {
  return (
    <div>
      {/* Animated background gradients */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-[10%] left-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[150px] animate-pulse"
          style={{
            transform: "translateX(-50%)",
          }}
        ></div>

        <div
          className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gray-400 rounded-full blur-[120px] animate-pulse"
          style={{
            transform: "translateX(-50%)",
          }}
        ></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
    </div>
  );
};

export default FindAdviserDesigns;
