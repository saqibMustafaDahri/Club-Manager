import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { locations, type Location } from "@/data/locations";

export const Route = createFileRoute("/admin/locations")({
  component: LocationsPage,
});

const columns: Column<Location>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Location", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "city", header: "City" },
  { key: "country", header: "Country" },
  { key: "manager", header: "Manager" },
  { key: "participants", header: "Participants", sortable: true },
  { key: "staff", header: "Staff" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "monthlyRevenue", header: "Revenue", render: (r) => <span className="font-semibold">€{r.monthlyRevenue.toLocaleString()}</span> },
];

function LocationsPage() {
  return (
    <>
      <PageHeader
        title="Locations"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Locations" }]}
        description="All academy sites across your network."
      />
      <div className="p-6">
        <DataTable
          columns={columns}
          data={locations}
          searchKeys={["name", "city", "manager", "country"]}
          searchPlaceholder="Search locations…"
          onAdd={() => {}}
          addLabel="Add location"
        />
      </div>
    </>
  );
}
