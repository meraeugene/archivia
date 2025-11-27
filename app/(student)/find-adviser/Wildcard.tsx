"use client";

import { Sparkles } from "lucide-react";
import AdviserThumbnail from "./AdviserThumbnail";
import { motion, Variants } from "framer-motion";
import { Adviser } from "@/types/advisers";

interface WildcardProps {
  wildcardAdvisers: Adviser[];
  cardVariants: Variants;
  containerVariants: Variants;
  setSelectedAdviser: (adviser: Adviser) => void;
  mounted: boolean;
}

const Wildcard = ({
  wildcardAdvisers,
  cardVariants,
  containerVariants,
  setSelectedAdviser,
  mounted,
}: WildcardProps) => {
  return (
    <div
      className={`transition-all duration-1000 delay-400 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-center justify-between  mb-10">
        <div className="flex items-center   gap-4">
          <div className="w-12 h-12  bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl  flex items-center justify-center">
            <Sparkles className="text-white animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Wildcard
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Advisers fit research interests{" "}
            </p>
          </div>
        </div>

        <div className="backdrop-blur-xl hidden md:flex  bg-white text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-2xl shadow-white/20">
          {wildcardAdvisers.length}{" "}
          {/* {wildcardAdvisers.length === 1 ? "OPTION" : "OPTIONS"} */}
          Interest Matches
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {wildcardAdvisers.map((adviser, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group/card relative"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

            <div
              className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10"
              onClick={() => {
                setSelectedAdviser(adviser);
                document.body.style.overflow = "hidden";
              }}
            >
              <AdviserThumbnail adviser={adviser} onClick={() => {}} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Wildcard;
