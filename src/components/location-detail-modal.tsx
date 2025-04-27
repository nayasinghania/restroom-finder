"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Phone, Globe, Clock } from "lucide-react"
import Image from "next/image";


export interface Location {
    id: string
    name: string
    position: {
      lat: number
      lng: number
    }
    //description: string
    address: string
    phone?: string
    website?: string
    hours?: string
    imageUrl?: string
    category?: string
  }
  

interface LocationDetailModalProps {
  location: Location | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationDetailModal({ location, isOpen, onOpenChange }: LocationDetailModalProps) {
  if (!location) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{location.name}</DialogTitle>
          <DialogDescription>{location.category}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Image
            src={/*location.imageUrl || */"/placeholder.svg"}
            alt={location.name}
            fill
            className="w-full h-48 object-cover rounded-md mb-4"
          />

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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${location.position.lat},${location.position.lng}`,
                  "_blank",
                )
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
