"use client";

import React, { useState } from "react";
import RequestCard from "./RequestCard";
import { Request } from "@/types/request";

interface RequestsListProps {
  adviserRequests: Request[];
}
const RequestsList = ({ adviserRequests }: RequestsListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {adviserRequests.map((request) => {
        const isExpanded = expandedId === request.id;

        return (
          <RequestCard
            key={request.id}
            request={request}
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
          />
        );
      })}
    </div>
  );
};

export default RequestsList;
