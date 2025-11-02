import { getAllTheses } from "@/actions/admin/manageThesis";
import ManageThesisClient from "./ManageThesisClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
  }>;
}) {
  const params = await searchParams;

  // Convert strings to numbers and provide defaults
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search || "";
  const sortBy = params.sortBy || "newest";

  const { theses, totalPages } = await getAllTheses({
    page,
    limit,
    search,
    sortBy,
  });

  return (
    <ManageThesisClient
      theses={theses}
      page={page}
      limit={limit}
      totalPages={totalPages}
    />
  );
}
