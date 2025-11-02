"use client";

import { Adviser } from "@/types/advisers";
import AdviserCard from "./AdviserCard";
import { Info } from "lucide-react";
import { useState } from "react";

interface RecommendationsListProps {
  recommendations: Adviser[];
  onConnect: (adviser: Adviser) => void;
  wildcardAdvisers: Adviser[];
}

const RecommendationsList = ({
  recommendations,
  onConnect,
  wildcardAdvisers,
}: RecommendationsListProps) => {
  const [showAllRecommended, setShowAllRecommended] = useState<{
    [key: number]: boolean;
  }>({});
  const [showAllWildcard, setShowAllWildcard] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleRecommended = (index: number) =>
    setShowAllRecommended((prev) => ({ ...prev, [index]: !prev[index] }));

  const toggleWildcard = (index: number) =>
    setShowAllWildcard((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div className="w-3/5 bg-gray-50 pr-5">
      {/* SIMILAR THESIS */}
      {/* <div className="pl-8 py-8 space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-black ">
            Most Similar Thesis
          </h2>
        </div>
      </div> */}

      {/* RECOMMENDED ADVISERS */}
      <div className="pl-8 py-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-black ">
            Recommended Advisers
          </h2>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-black text-white ">
            {recommendations.length} advisers found
          </div>
        </div>
        {/* Info notice */}{" "}
        <div className=" p-4 border border-blue-100 bg-blue-50 rounded-lg text-sm text-gray-800 flex items-start gap-2 mb-8">
          {" "}
          <Info className="text-blue-600 mt-0.5" size={18} />{" "}
          <p>
            {" "}
            <span className="font-medium">Important:</span> Only the{" "}
            <span className="text-gray-800 font-semibold">
              {" "}
              thesis group leader{" "}
            </span>{" "}
            is allowed to send adviser requests on behalf of the group. Please
            confirm your role before proceeding.{" "}
          </p>{" "}
        </div>
        {recommendations.map((adviser, index) => (
          <AdviserCard
            key={index}
            adviser={adviser}
            showAll={!!showAllRecommended[index]}
            onToggleShowAll={() => toggleRecommended(index)}
            onConnect={() => onConnect(adviser)}
          />
        ))}
      </div>

      {/* WILDCARD ADVISERS */}
      <div className="pl-8 py-8 space-y-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-black ">Wildcard Advisers</h2>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-black text-white ">
            {wildcardAdvisers.length} advisers found
          </div>
        </div>
        {/* Info notice */}{" "}
        <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg text-sm text-gray-800 flex items-start gap-2 mb-8">
          <Info className="text-blue-600 mt-0.5" size={18} />
          <p>
            <span className="font-medium">Note:</span> The following advisers
            are recommended based on a strong alignment between your project’s
            title and abstract and their{" "}
            <span className="text-gray-800 font-semibold">
              research interests
            </span>
            .
          </p>
        </div>
        {wildcardAdvisers.map((adviser, index) => (
          <AdviserCard
            key={index}
            adviser={adviser}
            showAll={!!showAllWildcard[index]}
            onToggleShowAll={() => toggleWildcard(index)}
            onConnect={() => onConnect(adviser)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
