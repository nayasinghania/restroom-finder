"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RestroomCard from "@/components/restroom-card";
import MapView from "@/components/map-view";
import MenstrualProductFilter from "@/components/menstrual-product-filter";
import Header from "@/components/header";
import { RestroomSelect } from "@/db/schema";

export default function HomePage() {
  const [restrooms, setRestrooms] = useState([]);

  useEffect(() => {
    async function fetchRestrooms() {
      try {
        const response = await fetch("/api/restrooms"); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch restrooms");
        }
        const data = await response.json();
        setRestrooms(data);
      } catch (error) {
        console.error("Error fetching restrooms:", error);
      }
    }

    fetchRestrooms();
  }, []);

  return (
    <main className="container mx-auto px-4 py-6">
      <Header />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-semibold">Nearby Restrooms</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <MenstrualProductFilter />
              <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
                <option>Highest Rated</option>
                <option>Nearest</option>
                <option>Most Reviewed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
            {restrooms.map((restroom: RestroomSelect) => (
              <RestroomCard key={restroom.id} id={restroom.id} />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 h-[50vh] lg:h-[calc(100vh-180px)] rounded-lg overflow-hidden border">
          <MapView />
        </div>
      </div>
    </main>
  );
}
