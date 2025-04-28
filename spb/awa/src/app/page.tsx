import React from "react";
import MainLayout from "@/components/layout/main-layout";
import StatCard from "@/components/ui/stat-card";
import DataTable from "@/components/ui/data-table";
import ClubIcon from "@/components/ui/club-icon";
import { clubsData, overviewStats } from "@/data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
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
    <MainLayout title="Overview">
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <span>Last updated {overviewStats.lastUpdated}</span>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          title="Clients"
          value={overviewStats.clients.count}
          change={overviewStats.clients.change}
          color="blue"
        />
        <StatCard
          title="Clubs"
          value={overviewStats.clubs.count}
          change={overviewStats.clubs.change}
          color="red"
        />
      </div>

      <Tabs defaultValue="client">
        <TabsList className="mb-4">
          <TabsTrigger value="client" className="px-4 py-2">
            New Client Requests
          </TabsTrigger>
          <TabsTrigger value="club" className="px-4 py-2">
            New Club Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          <DataTable data={clubsData} columns={columns} />
        </TabsContent>
        <TabsContent value="club">
          <DataTable data={clubsData} columns={columns} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
