"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MenstrualProductFilter() {
  const [showOnlyWithProducts, setShowOnlyWithProducts] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleStatusChange = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          Menstrual Products
          {(showOnlyWithProducts || statusFilter.length > 0) && (
            <span className="ml-1 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
              {showOnlyWithProducts ? 1 : 0 + statusFilter.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by Menstrual Products</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={showOnlyWithProducts}
          onCheckedChange={() => setShowOnlyWithProducts(!showOnlyWithProducts)}
        >
          Only show restrooms with products
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Product Status</DropdownMenuLabel>

        {["Well Stocked", "Running Low", "Empty"].map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={statusFilter.includes(status)}
            onCheckedChange={() => handleStatusChange(status)}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            size="sm"
            className="w-full bg-pink-500 hover:bg-pink-600"
            onClick={() => {
              // Apply filters
              console.log("Applying filters:", {
                showOnlyWithProducts,
                statusFilter,
              });
            }}
          >
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
