import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import DashboardMobileHeader from "@/components/DashboardMobileHeader";

export default async function page() {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-1">
      <DashboardMobileHeader headerTitle="Settings" />

      <div className="sticky top-0 z-40 shadow-xs px-8 py-4  bg-white hidden lg:block">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-8  max-w-5xl md:p-8 px-4 py-6 ">
        <ProfileForm currentUser={currentUser} />

        <ChangePasswordForm />
      </div>
    </main>
  );
}
