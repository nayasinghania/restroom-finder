"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { RestroomSelect } from "@/db/schema";

type Restroom = { id: string; address: string }; // No longer needed here if MapViewProps uses RestroomSelect
type LatLng = google.maps.LatLngLiteral;



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



export default function MapView() {
  const [center, setCenter] = useState({lat: 37.334, lng: -121.875}); // Default to SJSU
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [allMarkers, setAllMarkers] = useState<LatLng[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<LatLng[]>([]);
  //const [restroomMarkers, setRestroomMarkers] = useState<{restroom: RestroomSelect, position: LatLng}[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: 'annular-primer-458021-q3',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '',
    // Add the places library if you plan to use Places API features later
    // libraries: ['places']
  });

  // --- Simplified onLoad ---
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    fetch("/api/restrooms")         // your endpoint returning Restroom[]
      .then((r) => r.json())
      .then((data: Restroom[]) => {
        const geocoder = new window.google.maps.Geocoder();
        data.forEach((r) => {
          geocoder.geocode({ address: r.address }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const pos = results[0].geometry.location.toJSON();
              setAllMarkers((m) => [...m, pos]);
            }
          });
        });
      });
  }, []); // No dependencies needed here anymore

  // --- useEffect for Geocoding based on restrooms prop ---
  

  // --- onIdle remains mostly the same ---
  const onIdle = useCallback(() => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    setVisibleMarkers(
      allMarkers.filter((pos) =>
        bounds.contains(new window.google.maps.LatLng(pos))
      )
    );
  }, [map, allMarkers]); // Depends on restroomMarkers now


  const onUnmount = useCallback(function callback(map: google.maps.Map): void {
    setMap(null);
  }, []);

  // const onCenterChange = useCallback(function callback(): void {
  //   const bounds = new window.google.maps.LatLngBounds(center);
  //   if (map) {
  //     map.fitBounds(bounds);
  //     setMap(map);
  //     map.setZoom(10);
  //   }
  // }, [center, map]);

  
  useEffect(() => {
    if (map) {
       map.panTo(center);
       map.setZoom(15);
    }
  }, [center, map]);
  //const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Map CSS
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
      onUnmount={onUnmount}
      onIdle={onIdle}
      //onCenterChanged={onCenterChange}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {visibleMarkers.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}
    </GoogleMap>
  ) : (
    <></>
  )
}

