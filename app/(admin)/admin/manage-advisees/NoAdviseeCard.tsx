"use client";

import { Users } from "lucide-react";

const NoAdviseeCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-md">
      <Users className="h-12 w-12 text-gray-300 mb-3" />
      <p className="text-gray-500 text-sm font-extrabold">
        No advisees assigned yet
      </p>
    </div>
  );
};

export default NoAdviseeCard;
