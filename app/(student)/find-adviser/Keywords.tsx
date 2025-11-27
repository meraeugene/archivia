"use client";
import { Sparkles } from "lucide-react";

const Keywords = ({ mounted }: { mounted: boolean }) => {
  return (
    <div>
      <div
        className={`mb-16 transition-all duration-1000 delay-150 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-white" size={20} />
            <h3 className="text-xl font-bold text-white">Match Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "Machine Learning",
              "Natural Language Processing",
              "Computer Vision",
              "Deep Learning",
              "Neural Networks",
              "AI Ethics",
              "Data Science",
            ].map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 cursor-default"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keywords;
