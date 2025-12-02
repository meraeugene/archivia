"use client";

import { Button } from "@/components/ui/button";
import { EditableThesis, ManageThesis } from "@/types/manageThesis";
import { Dispatch, SetStateAction } from "react";

interface ThesesTableProps {
  filteredTheses: ManageThesis[];
  setIsEditOpen: (isOpen: boolean) => void;
  setSelectedThesis: (thesis: ManageThesis) => void;
  setEditData: Dispatch<SetStateAction<EditableThesis>>;
  setIsDeleteOpen: (isOpen: boolean) => void;
  page: number;
  limit: number;
}

const ThesesTable = ({
  filteredTheses,
  setIsEditOpen,
  setSelectedThesis,
  setEditData,
  setIsDeleteOpen,
  page,
  limit,
}: ThesesTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-black text-white uppercase text-sm">
        <tr>
          <th className="px-4 py-3 font-medium w-[20px]">#</th>
          <th className="px-4 py-3 font-medium">Title</th>
          <th className="px-4 py-3 font-medium">Adviser</th>
          <th className="px-4 py-3 font-medium">Panel Chair</th>
          {/* <th className="px-4 py-3 font-medium">Panel Member 2</th>
          <th className="px-4 py-3 font-medium">Panel Member 3</th> */}
          <th className="px-4 py-3 font-medium">Keywords</th>
          <th className="px-4 py-3 font-medium">Category</th>
          <th className="px-4 py-3 font-medium">Proponents</th>
          <th className="px-4 py-3 font-medium text-nowrap w-[100px]">
            Defense Year
          </th>
          <th className="px-4 py-3 font-medium text-center w-[100px]">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredTheses.length > 0 ? (
          filteredTheses.map((thesis, index) => (
            <tr
              key={thesis.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 text-gray-700 text-center">
                {(page - 1) * limit + index + 1}
              </td>

              <td className="px-4 py-2 font-medium text-gray-900 truncate max-w-[150px] whitespace-nowrap">
                {thesis.title}
              </td>

              <td className="px-4 py-2 text-gray-900 lg:whitespace-nowrap truncate lg:max-w-[150px]">
                {thesis.adviser_name || "—"}
              </td>
              {/* <td className="px-4 py-2 text-gray-900 lg:whitespace-nowrap truncate lg:max-w-[150px]">
                {thesis.panel_member1 || "—"}
              </td>
              <td className="px-4 py-2 text-gray-900 lg:whitespace-nowrap truncate lg:max-w-[150px]">
                {thesis.panel_member2 || "—"}
              </td> */}
              <td className="px-4 py-2 text-gray-900 lg:whitespace-nowrap truncate lg:max-w-[150px]">
                {thesis.panel_member3 || "—"}
              </td>
              <td className="px-4 py-2 text-gray-900 lg:whitespace-nowrap truncate lg:max-w-[150px] ">
                {thesis.keywords?.join(", ") || "—"}
              </td>
              <td className="px-4 py-2 text-gray-900 truncate lg:max-w-[100px] lg:whitespace-nowrap">
                {thesis.category?.join(", ") || "—"}
              </td>
              <td className="px-4 py-2 text-gray-700 truncate lg:max-w-[100px] lg:whitespace-nowrap">
                {thesis.proponents?.join(", ") || "—"}
              </td>
              <td className="px-4 py-2 text-gray-700   ">
                {thesis.defense_year || "—"}
              </td>

              <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                <Button
                  variant="outline"
                  className="border shadow-none border-gray-200 text-gray-800 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setSelectedThesis(thesis);
                    setEditData({ ...thesis });
                    setIsEditOpen(true);
                    document.body.classList.add("modal-open");
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  className="border shadow-none border-red-100 bg-red-50 text-red-500 rounded hover:bg-red-100 hover:text-red-600"
                  onClick={() => {
                    setSelectedThesis(thesis);
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
            <td colSpan={10} className="text-center text-gray-500 py-4">
              No theses found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ThesesTable;
