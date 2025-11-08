"use client";

const Hero = () => {
  return (
    <div className="relative ">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
      <div className="relative max-w-7xl mx-auto px-6 md:py-20 py-12 text-center">
        <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-5 tracking-tight">
          Digital Thesis Archive
        </h1>
        <div className="w-62 h-1 bg-white mx-auto md:mb-8 mb-4"></div>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Discover, explore, and access a growing collection of academic theses
          from the University of Science and Technology of Southern Philippines.
        </p>
      </div>
    </div>
  );
};

export default Hero;
