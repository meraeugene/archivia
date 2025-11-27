"use client";

import { Adviser } from "@/types/advisers";
import { useState, useEffect } from "react";
import { Variants } from "framer-motion";
import AdviserProfileCard from "./AdviserProfileCard";
import { Award } from "lucide-react";
import HeaderReset from "./HeaderReset";
import MobileStack from "./MobileStack";
import PyramidStack from "./PyramidStack";
import Wildcard from "./Wildcard";
import FindAdviserDesigns from "./FindAdviserDesigns";
import NoWildcards from "./NoWildcards";

interface RecommendationsListProps {
  recommendations: Adviser[];
  onConnect: (adviser: Adviser) => void;
  wildcardAdvisers: Adviser[];
  handleReset: () => void;
}

export const RecommendationsList = ({
  recommendations,
  onConnect,
  wildcardAdvisers,
  handleReset,
}: RecommendationsListProps) => {
  const [selectedAdviser, setSelectedAdviser] = useState<Adviser | null>(null);
  const [mounted, setMounted] = useState(false);

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
      transition: { staggerChildren: 0.12 },
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
        />

        {/* Recommended Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
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
        </div>

        {/* Wildcard Section */}
        <Wildcard
          wildcardAdvisers={wildcardAdvisers}
          cardVariants={cardVariants}
          containerVariants={containerVariants}
          setSelectedAdviser={setSelectedAdviser}
          mounted={mounted}
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
        />
      )}
    </div>
  );
};
