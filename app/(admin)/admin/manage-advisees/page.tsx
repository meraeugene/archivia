import { getAdviserAdvisees } from "@/actions/admin/getAdivserAdvisees";
import AdviserAdvisees from "./AdviserAdvisees";

const page = async () => {
  const adviserAdvisees = await getAdviserAdvisees();

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 px-8 py-4  bg-white shadow-xs">
        <h1 className="text-xl font-bold text-gray-900">Manage Advisees</h1>
      </div>

      <section className="p-8">
        <AdviserAdvisees data={adviserAdvisees} />
      </section>
    </main>
  );
};

export default page;
