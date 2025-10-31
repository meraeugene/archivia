import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import ProfilePageClient from "./ProfilePageClient";

export default async function Page() {
  const user = await getCurrentUser();

  return <ProfilePageClient profile={user} />;
}
