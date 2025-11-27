"use client";

import { motion, Variants } from "framer-motion";
import { Award } from "lucide-react";
import AdviserThumbnail from "./AdviserThumbnail";
import { Adviser } from "@/types/advisers";

interface MobileStackProps {
  recommendations: Adviser[];
  cardVariants: Variants;
  setSelectedAdviser: (adviser: Adviser) => void;
}

const MobileStack = ({
  recommendations,
  cardVariants,
  setSelectedAdviser,
}: MobileStackProps) => {
  return (
    <div className="md:hidden flex flex-col gap-6">
      {recommendations.map((adviser, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="group/card relative"
        >
          {index === 0 && (
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-2xl px-4  py-2 font-bold text-sm flex items-center gap-2 z-20 shadow-lg"
              animate={{
                boxShadow: ["0 0 10px #fff", "0 0 20px #fff", "0 0 10px #fff"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <Award size={16} />
              <span>BEST MATCH</span>
            </motion.div>
          )}

          <div className="absolute inset-0 bg-white rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

          <div
            className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02]"
            onClick={() => {
              setSelectedAdviser(adviser);
              document.body.classList.add("modal-open");
            }}
          >
            <AdviserThumbnail adviser={adviser} onClick={() => {}} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MobileStack;
