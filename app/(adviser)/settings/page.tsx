import { getCurrentUser } from "@/actions/auth";
import ProfileForm from "./ProfileForm";

export default async function page() {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-8 p-8 max-w-5xl ">
        <ProfileForm currentUser={currentUser} />
      </div>
    </main>
  );
}
