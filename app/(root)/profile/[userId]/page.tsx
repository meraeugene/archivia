import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import ProfilePageClient from "./ProfilePageClient";
import { getSessions } from "@/actions/auth/sessions";

export default async function Page() {
  const [user, sessions] = await Promise.all([getCurrentUser(), getSessions()]);

  return <ProfilePageClient profile={user} sessions={sessions} />;
}
