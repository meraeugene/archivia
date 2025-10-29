import { getAllUsers } from "@/actions/admin/manageUsers";
import ManageUsersClient from "./ManageUsersClient";

export default async function Page() {
  const users = await getAllUsers();

  return <ManageUsersClient users={users} />;
}
