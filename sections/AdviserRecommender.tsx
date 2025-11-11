"use client";

import Link from "next/link";

const AdviserRecommender = () => {
  return (
    <section
      id="features"
      className="py-20 bg-white  text-center border-t border-gray-200 "
    >
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-5xl text-black font-extrabold mb-5 tracking-tight">
          Thesis Adviser Recommender
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Get tailored thesis adviser recommendations that match your research
          interests and academic background. Find the right mentor to guide you
          confidently through your thesis journey.
        </p>

        <div className="flex justify-center">
          <Link
            href="/find-adviser"
            className="bg-black cursor-pointer text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Find My Adviser
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdviserRecommender;
