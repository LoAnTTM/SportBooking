import React from "react";
import MainLayout from "@/components/layout/main-layout";
import DataTable from "@/components/ui/data-table";
import ClubIcon from "@/components/ui/club-icon";
import { Button } from "@/components/ui/button";
import { clubsData } from "@/data/mock-data";

export default function ClubPage() {
  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row: any) => (
        <div className="flex items-center">
          <ClubIcon type={row.type as any} className="mr-3" />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      header: "Date Added",
      accessor: "dateAdded",
    },
    {
      header: "SKU",
      accessor: "sku",
    },
    {
      header: "Price",
      accessor: "price",
    },
    {
      header: "Purchases",
      accessor: "purchases",
    },
  ];

  return (
    <MainLayout title="Clubs" showSearch>
      <div className="mb-6">
        <Button className="bg-gray-900 hover:bg-gray-800">New Club</Button>
      </div>
      <DataTable data={clubsData} columns={columns} />
    </MainLayout>
  );
}
