"use client";

import { Sparkles } from "lucide-react";

const NoWildcards = () => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Sparkles className="text-gray-400" size={32} />
      </div>
      <p className="text-gray-400 text-lg">
        No wildcard matches available at this time
      </p>
    </div>
  );
};

export default NoWildcards;
