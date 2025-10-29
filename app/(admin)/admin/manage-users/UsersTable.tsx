"use client";

import { Button } from "@/components/ui/button";
import { EditUserData } from "@/types/manageUser";
import { Dispatch, SetStateAction } from "react";

interface UsersTableProps {
  filteredUsers: {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    full_name: string;
    email: string;
  }[];
  setIsEditOpen: (isOpen: boolean) => void;
  setSelectedUser: (user: UsersTableProps["filteredUsers"][number]) => void;
  setEditData: Dispatch<SetStateAction<EditUserData>>;
  setIsDeleteOpen: (isOpen: boolean) => void;
}

const UsersTable = ({
  filteredUsers,
  setIsEditOpen,
  setSelectedUser,
  setEditData,
  setIsDeleteOpen,
}: UsersTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-black text-white uppercase text-sm">
        <tr>
          <th className="px-4 py-3 font-medium">User ID</th>
          <th className="px-4 py-3 font-medium">Full Name</th>
          <th className="px-4 py-3 font-medium">Email</th>
          <th className="px-4 py-3 font-medium">Role</th>
          <th className="px-4 py-3 font-medium">Created At</th>
          <th className="px-4 py-3 font-medium text-center  w-[100px]">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 font-medium text-gray-900">
                {user.user_id}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {user.full_name || "—"}
              </td>
              <td className="px-4 py-3 text-gray-700">{user.email || "—"}</td>
              <td className="px-4 py-2 text-gray-700 capitalize  ">
                {user.role}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2  space-x-2 whitespace-nowrap">
                <Button
                  variant="outline"
                  className="border shadow-none border-gray-200 text-gray-800 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setSelectedUser(user);
                    setEditData({
                      user_id: user.user_id,
                      full_name: user.full_name || "",
                      email: user.email || "",
                      password: "",
                      role: user.role || "",
                    });
                    setIsEditOpen(true);
                    document.body.classList.add("modal-open");
                  }}
                >
                  Edit
                </Button>

                {/* Delete Button */}
                <Button
                  variant="outline"
                  className="border shadow-none border-red-100 bg-red-50 text-red-500 rounded hover:bg-red-100 hover:text-red-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDeleteOpen(true);
                    document.body.classList.add("modal-open");
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center text-gray-500 py-4">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UsersTable;
