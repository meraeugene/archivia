"use client";

import { FileText } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  count: string | number;
  icon: ReactNode;
  desc: string;
  cardClass: string;
  iconClass: string;
  textColorClass: string;
}

const StatsCard = ({
  cardClass,
  title,
  count,
  icon,
  desc,
  iconClass,
  textColorClass,
}: StatsCardProps) => {
  return (
    <div className={`${cardClass} border-l-4 p-6 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${textColorClass}`}>{count}</p>
        </div>
        <div className={`${iconClass} p-3 rounded-lg`}>{icon}</div>
      </div>

      <div className="mt-4 flex items-center text-sm">
        <span className="text-gray-500"> {desc}</span>
      </div>
    </div>
  );
};

export default StatsCard;
