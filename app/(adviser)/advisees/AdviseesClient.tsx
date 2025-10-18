"use client";

import { Request } from "@/types/request";
import RequestsList from "../../../components/RequestsList";

interface Props {
  requests: Request[];
  adviserCapacity: string;
}

export default function AdviseesClient({ requests, adviserCapacity }: Props) {
  return (
    <main className="flex-1">
      <div className="px-8 py-3 border-b bg-white border-gray-200 flex items-center  gap-4">
        <h1 className="text-lg font-bold text-gray-900">Advisees</h1>
        <div className=" bg-black px-4 py-1 rounded">
          <span className="text-lg font-bold text-white">
            {adviserCapacity}
          </span>
        </div>
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
