import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { RestroomSelect } from "@/db/schema";

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
  const [allMarkers, setAllMarkers] = useState<RestroomWithPosition[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<RestroomWithPosition[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: 'annular-primer-458021-q3',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '',
  });

  // Geocode restrooms when they change
  useEffect(() => {
    if (!isLoaded || restrooms.length === 0) return;

    const geocoder = new window.google.maps.Geocoder();
    const geocodeRestrooms = async () => {
      const markers: RestroomWithPosition[] = [];
      
      for (const restroom of restrooms) {
        try {
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ address: restroom.address }, (results, status) => {
              if (status === "OK" && results) {
                resolve(results);
              } else {
                reject(status);
              }
            });
          });
          
          if (result[0]) {
            markers.push({
              restroom,
              position: result[0].geometry.location.toJSON()
            });
          }
        } catch (error) {
          console.error(`Error geocoding ${restroom.address}:`, error);
        }
      }
      
      setAllMarkers(markers);
    };
    
    geocodeRestrooms();
  }, [isLoaded, restrooms]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Update visible markers when map bounds change
  const onIdle = useCallback(() => {
    if (!map) return;
    
    const bounds = map.getBounds();
    if (!bounds) return;
    
    const visible = allMarkers.filter(marker => 
      bounds.contains(new window.google.maps.LatLng(marker.position))
    );
    
    setVisibleMarkers(visible);
    
    // Notify parent component about visible restrooms
    onVisibleRestroomsChange(visible.map(m => m.restroom));
  }, [map, allMarkers, onVisibleRestroomsChange]);

  const onUnmount = useCallback(function callback(map: google.maps.Map): void {
    setMap(null);
  }, []);

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
      } catch (error: any) {
        if (error.code === 3) {
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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onIdle={onIdle}
      onUnmount={onUnmount}
    >
      {visibleMarkers.map((marker) => (
        <Marker 
          key={marker.restroom.id}
          position={marker.position}
        />
      ))}
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
}