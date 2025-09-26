"use client";

import { Request } from "@/types/request";
import RequestsList from "../dashboard/RequestsList";

interface Props {
  requests: Request[];
  adviserCapacity: string;
}

export default function AdviseesClient({ requests, adviserCapacity }: Props) {
  return (
    <main className="flex-1">
      <div className="px-8 py-4 border-b bg-white border-gray-200 flex items-center space-x-3">
        <h1 className="text-lg font-bold text-gray-900">Advisees</h1>
        <span className="inline-flex items-center justify-center px-4 py-1 rounded bg-gray-900 text-white  font-bold">
          {adviserCapacity}
        </span>
      </div>

      {requests.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500  text-center">
            No accepted student leaders yet.
          </p>
        </div>
      )}

      <div className="p-8">
        <RequestsList adviserRequests={requests} />
      </div>
    </main>
  );
}
