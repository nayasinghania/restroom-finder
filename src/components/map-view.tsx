import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { RestroomSelect } from "@/db/schema";
import { LocationDetailModal } from "./location-detail-modal";
import { RestroomData } from "./restroom-card";
import { Loader2 } from "lucide-react";

type LatLng = google.maps.LatLngLiteral;
type RestroomWithPosition = { 
  restroom: RestroomSelect, 
  position: LatLng 
};

interface MapViewProps {
  restrooms: RestroomSelect[];
  onVisibleRestroomsChange: (visibleRestrooms: RestroomSelect[]) => void;
}

async function getUserLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    

    const options = {
      enableHighAccuracy: false,  // faster, "coarse" location
      timeout:        30000,      // wait up to 30 s
      maximumAge:     600000      // allow a 10 min cached fix
    };

    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      console.log("Getting Location!");
      return navigator.geolocation.getCurrentPosition(resolve, reject, options);
    }
  });
}

export default function MapView({ restrooms, onVisibleRestroomsChange }: MapViewProps) {
  const [center, setCenter] = useState({lat: 37.334, lng: -121.875});
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedRestroom, setSelectedRestroom] = useState<RestroomSelect | null>(null);
  const [selectedRestroomPosition, setSelectedRestroomPosition] = useState<LatLng | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailedRestroomData, setDetailedRestroomData] = useState<RestroomData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [allMarkers, setAllMarkers] = useState<RestroomWithPosition[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<RestroomWithPosition[]>([]);


  const { isLoaded } = useJsApiLoader({
    id: 'annular-primer-458021-q3',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '',
  });

  // Geocode restrooms when they change
  useEffect(() => {
    // Guard clause: Ensure everything needed is available
    if (!isLoaded || !map || !restrooms) {
      // If restrooms become explicitly empty, clear markers and notify parent
      if (restrooms && restrooms.length === 0) {
         console.log("MapView: restrooms prop empty, clearing states.");
         setAllMarkers([]);
         setVisibleMarkers([]);
         onVisibleRestroomsChange([]);
      }
      return; 
    }
    
    // Only proceed if there are restrooms to geocode
    if (restrooms.length === 0) return;

    console.log("MapView: Ready to geocode", { isLoaded, mapExists: !!map, numRestrooms: restrooms.length });
    const geocoder = new window.google.maps.Geocoder();
    let isMounted = true; // Flag to prevent state updates if component unmounts during async ops

    const geocodeAndFilter = async () => {
      const markers: RestroomWithPosition[] = [];
      for (const restroom of restrooms) {
        if (!isMounted) return; // Stop if unmounted
        try {
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: restroom.address }, (results, status) => {
              if (status === "OK" && results) resolve(results);
              else reject(status);
            });
          });
          if (result[0]) {
            markers.push({ restroom, position: result[0].geometry.location.toJSON() });
          }
        } catch (error) {
          console.error(`Error geocoding ${restroom.address}:`, error);
        }
      }

      if (!isMounted) return; // Check again after async loop

      console.log("MapView: Geocoding complete, setting all markers:", markers.length);
      setAllMarkers(markers);

      // --- Perform initial filtering immediately after geocoding ---
      const currentMap = map; // Use map state directly
      if (currentMap) {
          const bounds = currentMap.getBounds();
          if (bounds) {
              console.log("MapView: Calculating initial visibility with bounds.");
              const initiallyVisibleMarkers = markers.filter(marker =>
                  bounds.contains(new window.google.maps.LatLng(marker.position))
              );
              if (isMounted) { // Final check before state updates
                setVisibleMarkers(initiallyVisibleMarkers); // Update local visible state
                onVisibleRestroomsChange(initiallyVisibleMarkers.map(m => m.restroom)); // Notify parent
                console.log("MapView: Initial visible markers set:", initiallyVisibleMarkers.length);
              }
          } else {
              // Bounds might not be ready *immediately* after map load in some rare cases
              console.warn("MapView: Initial bounds not ready immediately after geocoding. Waiting for onIdle.");
              if (isMounted) {
                 setVisibleMarkers([]); // Default to empty if bounds aren't ready
                 onVisibleRestroomsChange([]);
              }
          }
      } else {
          // Should not happen due to guard clause, but defensive check
           console.error("MapView: Map instance lost before initial filter.");
           if (isMounted) {
             setVisibleMarkers([]);
             onVisibleRestroomsChange([]);
           }
      }
    };

    geocodeAndFilter();

    // Cleanup function to set the mounted flag to false when the component unmounts
    // or when dependencies change causing the effect to re-run
    return () => {
      isMounted = false;
      console.log("MapView: Geocoding effect cleanup.");
    };
  // Add map and onVisibleRestroomsChange to dependencies
  }, [isLoaded, restrooms, map, onVisibleRestroomsChange]);

    // Handle marker click
    const handleMarkerClick = (markerData: RestroomWithPosition) => {
      setSelectedRestroom(markerData.restroom);
      setSelectedRestroomPosition(markerData.position); // Store position
      setDetailedRestroomData(null); // Clear old detailed data
      setShowInfoWindow(true);
      setShowDetailModal(false);
    }
  
    // Close info window
    const handleInfoWindowClose = () => {
      setShowInfoWindow(false);
      setSelectedRestroom(null); // Clear selection when info window closes
      setSelectedRestroomPosition(null);
      setDetailedRestroomData(null);
    }
  
    // Open detailed modal
    const openDetailModal = async () => {
      if (!selectedRestroom) return;
  
      setShowInfoWindow(false); // Close info window first
      setIsDetailLoading(true);
      setDetailedRestroomData(null); // Clear previous data while loading
  
      try {
        const response = await fetch(`/api/restroom?id=${selectedRestroom.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch restroom details");
        }
        
        const data: RestroomData = await response.json();
      
        setDetailedRestroomData(data);
        setShowDetailModal(true); // Open modal only after successful fetch
        console.log("Fetched detailed data:", data);
      } catch (error) {
        console.error("Error fetching restroom details:", error);
        // Optionally show an error message to the user
      } finally {
        setIsDetailLoading(false);
      }
    }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Update visible markers when map bounds change
  const onIdle = useCallback(() => {
    if (!map || allMarkers.length === 0) { // Check allMarkers here
      console.log("MapView: onIdle skipped (no map or no markers)");
      return; // Don't filter if geocoding hasn't finished or map is gone
   }
    
    const bounds = map.getBounds();
    if (!bounds) return;
    
    const visible = allMarkers.filter(marker => 
      bounds.contains(new window.google.maps.LatLng(marker.position))
    );
    
    setVisibleMarkers(visible);
    
    // Notify parent component about visible restrooms
    onVisibleRestroomsChange(visible.map(m => m.restroom));
  }, [map, allMarkers, onVisibleRestroomsChange]);

  
  useEffect(() => {
    if (map) {
       map.panTo(center);
       map.setZoom(15);
    }
  }, [center, map]);
  
  useEffect(() => {
    async function fetchLocation() {
      try {
        const position = await getUserLocation();
        console.log({"lat": position.coords.latitude});
        console.log({"lng": position.coords.longitude});
        setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
      } catch (error: unknown) {
        if (error instanceof GeolocationPositionError && error.code === 3) {
          // retry without high-accuracy and a short timeout
          navigator.geolocation.getCurrentPosition(
            pos => setCenter({lat: pos.coords.latitude, lng: pos.coords.longitude}),
            console.error,
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
          );
        } else {
        console.error('Error getting location:', error);
        }
      }
    }
    fetchLocation();
  }, []);

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  return isLoaded ? (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onIdle={onIdle}
      onClick={handleInfoWindowClose}
    >
      {visibleMarkers.map((marker) => (
        <Marker 
          key={marker.restroom.id}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}

      {selectedRestroom && selectedRestroomPosition && showInfoWindow && (
          <InfoWindow
            position={selectedRestroomPosition}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-1 w-48"> {/* Adjusted padding and width */}
              <h3 className="font-semibold text-sm mb-1 truncate text-black">{selectedRestroom.name}</h3>
              <p className="text-xs text-gray-800 mb-2 line-clamp-2">{selectedRestroom.address}</p>
              <Button
                className="w-full"
                size="sm" // Smaller button
                onClick={openDetailModal}
                disabled={isDetailLoading} // Disable while loading details
              >
                {isDetailLoading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : null}
                {isDetailLoading ? "Loading..." : "View Details"}
              </Button>
            </div>
          </InfoWindow>
      )}
    </GoogleMap>
    <LocationDetailModal
        // Construct the 'location' prop expected by the modal
        // using a combination of detailed and basic data
        location={detailedRestroomData && selectedRestroomPosition ? {
          id: detailedRestroomData.id,
          name: detailedRestroomData.name,
          position: selectedRestroomPosition, // Use the stored position
          address: detailedRestroomData.address,
          // Include other fields from RestroomData if LocationDetailModal uses them
          // e.g., map hours, website if they exist in RestroomData,
          // or use fallback from selectedRestroom if necessary
          hours: selectedRestroom?.hours, // Example fallback
          imageUrl: detailedRestroomData.images?.[0], // Use detailed image
          category: detailedRestroomData.features?.[0], // Use detailed feature
          // Add rating/review info if you modify LocationDetailModal to show it
           averageRating: detailedRestroomData.averageRating,
           reviewCount: detailedRestroomData.reviewCount,
        } : null}
        isOpen={showDetailModal && !isDetailLoading} // Only open when not loading and data is potentially ready
        onOpenChange={setShowDetailModal}
      />

    </div>
  ) : (
    <div>Loading Map...</div>
  );
}
