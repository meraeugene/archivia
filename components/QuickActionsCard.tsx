"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface QuickActionsCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  link: string;
}
const QuickActionsCard = ({
  title,
  desc,
  icon,
  link,
}: QuickActionsCardProps) => {
  return (
    <Link
      prefetch
      href={link}
      className="bg-white p-6  text-left group rounded-lg border border-gray-100 shadow-xs  hover:shadow-md transition-shadow"
    >
      <div className="flex items-center  mb-4">
        <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 ">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </Link>
  );
};

export default QuickActionsCard;
