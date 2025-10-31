"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  count: string | number;
  icon: ReactNode;
  desc: string;
  iconClass: string;
  textColorClass?: string;
}

const StatsCard = ({
  title,
  count,
  icon,
  desc,
  iconClass,
  textColorClass,
}: StatsCardProps) => {
  return (
    <div className=" p-6 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
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
