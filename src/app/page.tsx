import Link from "next/link";
import { Search, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RestroomCard from "@/components/restroom-card";
import MapView from "@/components/map-view";
import MenstrualProductFilter from "@/components/menstrual-product-filter";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold mr-2">RestroomFinder</h1>
          <MapPin className="h-5 w-5 text-teal-500" />
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search restrooms..." className="pl-8" />
          </div>
          <Link href="/add-restroom" className="w-full sm:w-auto">
            <Button className="bg-teal-600 hover:bg-teal-700 w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Restroom
            </Button>
          </Link>
        </div>
      </header>

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
            {[1, 2, 3, 4, 5].map((id) => (
              <RestroomCard key={id} id={id} />
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
