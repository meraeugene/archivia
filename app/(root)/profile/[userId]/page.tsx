import { getCurrentUser } from "@/actions/auth";
import ProfilePageClient from "./ProfilePageClient";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <p>Not authorized or session expired.</p>
      </div>
    );
  }

  return <ProfilePageClient profile={user} />;
}
