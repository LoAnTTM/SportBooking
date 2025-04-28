import React from "react";
import { ChevronLeft, ChevronRight, MoreVertical, Search } from "lucide-react";
import { Input } from "./input";

interface DataTableProps {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (row: any) => React.ReactNode;
  }[];
  showSearch?: boolean;
}

const DataTable = ({ data, columns, showSearch = true }: DataTableProps) => {
  return (
    <div className="rounded-md border bg-white">
      {showSearch && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">5 of 20</p>
            <div className="flex">
              <button className="rounded-l-md border p-1 hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-r-md border border-l-0 p-1 hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[200px] bg-gray-100 pl-8 text-sm"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
              {columns.map((column) => (
                <th key={column.accessor} className="px-4 py-3">
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b text-sm last:border-0 hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.accessor} className="px-4 py-3">
                    {column.cell
                      ? column.cell(row)
                      : row[column.accessor]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button className="rounded-full p-1 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
