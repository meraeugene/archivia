"use client";

import { Request } from "@/types/request";
import RequestsList from "../../../../components/RequestsList";
import DashboardMobileHeader from "@/components/DashboardMobileHeader";

interface Props {
  requests: Request[];
}

export default function AdviseesClient({ requests }: Props) {
  return (
    <main className="flex-1">
      <DashboardMobileHeader headerTitle="Advisees" />

      <div className="sticky  shadow-xs top-0 z-40 px-8 py-4  bg-white hidden lg:block">
        <h1 className="text-lg font-bold text-gray-900">Advisees</h1>
      </div>

      {requests.length === 0 && (
        <div className="flex items-center justify-center md:p-8 px-4 py-6">
          <p className="text-gray-500  text-center">
            No accepted student leaders yet.
          </p>
        </div>
      )}

      <div className="md:p-8 px-4 py-6">
        <RequestsList adviserRequests={requests} />
      </div>
    </main>
  );
}
