"use client";

import { Adviser } from "@/types/advisers";
import { useState, useEffect } from "react";
import { Variants } from "framer-motion";
import AdviserProfileCard from "./AdviserProfileCard";
import { Award, Lightbulb } from "lucide-react";
import HeaderReset from "./HeaderReset";
import MobileStack from "./MobileStack";
import PyramidStack from "./PyramidStack";
import Wildcard from "./Wildcard";
import FindAdviserDesigns from "./FindAdviserDesigns";
import NoWildcards from "./NoWildcards";
import { motion } from "framer-motion";
import TypingText from "./TypingEffect";
import GraphModal from "./GraphModal";

interface RecommendationsListProps {
  recommendations: Adviser[];
  onConnect: (adviser: Adviser) => void;
  wildcardAdvisers: Adviser[];
  handleReset: () => void;
  explanations: { overall: string; top1: string };
  radarData: {
    name: string;
    similarity: number;
    experience: number;
    overall: number;
    top_project: {
      title: string;
      similarity: number;
    };
  }[];
}

export const RecommendationsList = ({
  recommendations,
  onConnect,
  wildcardAdvisers,
  handleReset,
  explanations,
  radarData,
}: RecommendationsListProps) => {
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toggleGraphModal, setToggleGraphModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Motion variants for cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 14,
        mass: 0.8,
        duration: 1.5,
      },
    },
  };

  // Container variant to stagger children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <FindAdviserDesigns />

      <div className="relative max-w-6xl mx-auto pb-20 pt-12 px-6 xl:px-0 ">
        <HeaderReset
          recommendations={recommendations}
          handleReset={handleReset}
          mounted={mounted}
          openGraphModal={() => {
            setToggleGraphModal(true);
            document.body.style.overflow = "hidden";
          }}
        />

        {/* Recommended Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Recommended
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Best matches for your research
                </p>
              </div>
            </div>

            <div className="items-center gap-3 hidden md:flex">
              <div className="backdrop-blur-xl bg-white text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-2xl shadow-white/20">
                {recommendations.length}{" "}
                {recommendations.length === 1 ? "MATCH" : "MATCHES"}
              </div>
            </div>
          </div>

          <MobileStack
            recommendations={recommendations}
            cardVariants={cardVariants}
            setSelectedAdviser={setSelectedAdviser}
          />

          <PyramidStack
            cardVariants={cardVariants}
            containerVariants={containerVariants}
            setSelectedAdviser={setSelectedAdviser}
            recommendations={recommendations}
          />
        </motion.div>

        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Title */}
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
              <Lightbulb className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Explanation
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Why these advisers were recommended
              </p>
            </div>
          </motion.div>

          {/* Typing paragraph */}
          <TypingText
            text={explanations.overall}
            className="md:text-xl text-white font-light leading-relaxed"
            startDelay={1.3}
            speed={25}
          />
        </motion.div>

        {/* Wildcard Section */}
        <Wildcard
          wildcardAdvisers={wildcardAdvisers}
          cardVariants={cardVariants}
          setSelectedAdviser={setSelectedAdviser}
        />

        {/* Empty State for Wildcards */}
        {wildcardAdvisers.length === 0 && <NoWildcards />}
      </div>

      {selectedAdviser && (
        <AdviserProfileCard
          adviser={selectedAdviser}
          onClose={() => {
            setSelectedAdviser(null);
            document.body.style.overflow = "auto";
          }}
          onConnect={() => onConnect(selectedAdviser)}
          top1Explanation={explanations.top1}
          isTop1={selectedAdviser === recommendations[0]}
        />
      )}

      {toggleGraphModal && (
        <GraphModal
          onClose={() => {
            setToggleGraphModal(false);
            document.body.style.overflow = "auto";
          }}
          radarData={radarData}
        />
      )}
    </div>
  );
};
