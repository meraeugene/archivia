"use client";

interface CustomRadarTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      similarity: number;
      experience: number;
      overall: number;
    };
    value: number;
    dataKey: string;
    color?: string;
  }>;
  label?: string | number;
}

export const CustomRadarTooltip = ({
  active,
  payload,
}: CustomRadarTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const colors = {
      similarity: "#4ade80", // green
      experience: "#60a5fa", // blue
    };

    return (
      <div className="bg-white text-black rounded-lg p-3 shadow-lg">
        <div className="text-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-xs"
              style={{ backgroundColor: colors.similarity }}
            />
            <span>Similarity: {data.similarity.toFixed(3)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-xs"
              style={{ backgroundColor: colors.experience }}
            />
            <span>Experience: {data.experience.toFixed(3)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs" />
            <span>Overall: {data.overall.toFixed(3)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
