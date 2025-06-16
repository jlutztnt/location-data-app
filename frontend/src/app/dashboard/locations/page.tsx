import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationsTable } from "@/components/locations-table";

export default function LocationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Locations</h1>
        <Button>Add Location</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
          <CardDescription>
            A list of all Toot&apos;n Totum store locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationsTable />
        </CardContent>
      </Card>
    </div>
  );
}
