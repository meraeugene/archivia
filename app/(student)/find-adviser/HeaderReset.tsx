"use client";

import { Adviser } from "@/types/advisers";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";

interface HeaderResetProps {
  recommendations: Adviser[];
  handleReset: () => void;
  mounted: boolean;
}

const HeaderReset = ({
  recommendations,
  handleReset,
  mounted,
}: HeaderResetProps) => {
  return (
    <div
      className={`flex items-end justify-center md:justify-between    flex-wrap gap-6  mb-12 transition-all duration-1000 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center justify-center flex-col w-full md:w-auto md:block">
        {/* <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-semibold">
            AI-Matched Results
          </span>
        </div> */}

        {/* 
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white  text-black rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4 " />
          <span className="text-black font-semibold">AI-Matched Results</span>
        </div> */}

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white   text-black rounded-full text-sm font-medium "
          animate={{
            boxShadow: [
              "0 0 10px rgba(255, 255, 255, 0.4)",
              "0 0 20px rgba(255, 255, 255, 0.8)",
              "0 0 10px rgba(255, 255, 255, 0.4)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span className=" text-black  font-semibold">AI-Matched Results</span>
        </motion.div>

        <h1 className="text-5xl text-center md:text-6xl font-bold bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
          Your Matches
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="items-center gap-3  md:hidden">
          <div className="backdrop-blur-xl text-center bg-white text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-2xl shadow-white/20">
            {recommendations.length}{" "}
            {recommendations.length === 1 ? "MATCH" : "MATCHES"}
          </div>
        </div>

        <div className="flex items-center gap-4    ">
          <button
            onClick={handleReset}
            className="group/btn mx-auto backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-3.5 font-semibold text-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-white/10"
          >
            <RefreshCw
              size={18}
              className="group-hover/btn:rotate-180 transition-transform duration-500"
            />
            <span className="text-xs">New Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderReset;
