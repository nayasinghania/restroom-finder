"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Phone, Globe, Clock, Star } from "lucide-react"
import Image from "next/image";


export interface Location {
    id: string
    name: string
    position: { lat: number; lng: number; };
    address: string;
    phone?: string; // Keep if available elsewhere
    website?: string; // Keep if available elsewhere
    hours?: string; // Use from RestroomSelect or RestroomData
    imageUrl?: string; // Use from RestroomData
    category?: string; // Use from RestroomData features
    // Add specific fields from RestroomData you want to show
    averageRating?: number;
    reviewCount?: number;
    // ... other RestroomData fields?
}
  

interface LocationDetailModalProps {
  location: Location | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationDetailModal({ location, isOpen, onOpenChange }: LocationDetailModalProps) {
  if (!location) return null


  console.log('Modal received location data:', location); 
  console.log("Average rating:", location.averageRating, typeof location.averageRating);

  //const imageUrl = location.imageUrl || "/placeholder.svg"; // Simpler fallback for now

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{location.name}</DialogTitle>
          <DialogDescription className="flex items-center space-x-2 pt-1">
            {location.category && (
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                    {location.category}
                </span>
            )}
            {/* Check if averageRating is defined and greater than 0 */}
            {(typeof location.averageRating === 'number' && location.averageRating > 0) && (
                <span className="flex items-center text-sm font-medium">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {location.averageRating.toFixed(1)}
                    {location.reviewCount !== undefined && (
                       <span className="text-muted-foreground text-xs ml-1">
                         ({location.reviewCount} reviews)
                       </span>
                    )}
                </span>
             )}
             {/* Handle case where there are no ratings yet */}
             {(typeof location.averageRating !== 'number' || location.averageRating <= 0)  && (
                 <span className="text-xs text-muted-foreground italic">No ratings yet</span>
             )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
            <div className="relative w-full h-48 rounded-md mb-4 overflow-hidden">
            <Image
                src={/*location.imageUrl || */"/placeholder.svg"}
                alt={location.name}
                fill
                className="object-cover"
            />
            </div>
          {/*<p className="text-sm text-gray-700 mb-4">{location.description}</p> */}

          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span>{location.address}</span>
            </div>

            {location.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <span>{location.phone}</span>
              </div>
            )}

            {location.website && (
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                <a
                  href={location.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {location.hours && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>{location.hours}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => {
                console.log('Close button Clicked');
                onOpenChange(false)}}>
              Close
            </Button>
            <Button
              onClick={() => {
                console.log('Get Directions clicked. Location:', location);
                console.log('Position:', location.position);
                if (location.position?.lat !== undefined && location.position?.lng !== undefined) {
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`;
                  console.log('Opening URL:', mapsUrl);
                  window.open(mapsUrl, "_blank");
                } else {
                   console.error('Cannot get directions: Position data is invalid.');
                }
              }}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
