import ChangePasswordForm from "./ChangePasswordForm";

export default async function page() {
  return (
    <main className="flex-1">
      <div className="sticky top-0 z-40 px-8 py-4 border-b bg-white border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-8 p-8 max-w-5xl ">
        <ChangePasswordForm />
      </div>
    </main>
  );
}
