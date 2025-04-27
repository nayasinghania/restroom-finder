"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RestroomCard from "@/components/restroom-card";
import MapView from "@/components/map-view";
import MenstrualProductFilter from "@/components/menstrual-product-filter";
import Header from "@/components/header";
import { RestroomSelect } from "@/db/schema";

export default function HomePage() {
  const [allRestrooms, setAllRestrooms] = useState<RestroomSelect[]>([]);
  const [visibleRestrooms, setVisibleRestrooms] = useState<RestroomSelect[]>([]);

  useEffect(() => {
    async function fetchRestrooms() {
      try {
        const response = await fetch("/api/restrooms");
        if (!response.ok) {
          throw new Error("Failed to fetch restrooms");
        }
        
        const data = await response.json();
        setAllRestrooms(data);
        // Initially set all restrooms as visible until map filters them
        //setVisibleRestrooms(data);
      } catch (error) {
        console.error("Error fetching restrooms:", error);
      }
    }
    
    fetchRestrooms();
  }, []);

  // Handle updates from MapView when viewport changes
  const handleVisibleRestroomsChange = (newVisibleRestrooms: RestroomSelect[]) => {
    setVisibleRestrooms(newVisibleRestrooms);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 flex-grow">
        <div className="p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Nearby Restrooms</h2>
          <div className="flex space-x-2 mb-4">
            <MenstrualProductFilter />
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Highest Rated</Button>
            <Button variant="outline">Nearest</Button>
            <Button variant="outline">Most Reviewed</Button>
          </div>
          
          {visibleRestrooms.length > 0 ? (
            <div className="space-y-4">
              {visibleRestrooms.map((restroom: RestroomSelect) => (
                <RestroomCard key={restroom.id} id={restroom.id} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No restrooms visible in the current map area. Try zooming out or panning the map.
            </p>
          )}
        </div>
        
        <div className="bg-gray-100">
          <MapView 
            restrooms={allRestrooms} 
            onVisibleRestroomsChange={handleVisibleRestroomsChange}
          />
        </div>
      </div>
    </div>
  );
}
