'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth-client";

type Location = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export function LocationsTable() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const session = await getSession();
      if (!session.user) {
        setError("You must be logged in to view locations.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          setError('Failed to fetch locations');
        }
      } catch {
        setError('An error occurred while fetching locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <div>Loading locations...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>City</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Zip</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => (
          <TableRow key={location.id}>
            <TableCell>{location.name}</TableCell>
            <TableCell>{location.address}</TableCell>
            <TableCell>{location.city}</TableCell>
            <TableCell>{location.state}</TableCell>
            <TableCell>{location.zip}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
