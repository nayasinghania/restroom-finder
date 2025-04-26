"use client";

import { useEffect, useState, useCallback } from "react";
//import { MapPin } from "lucide-react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';


async function getUserLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    

    const options = {
      enableHighAccuracy: true, // Try to get the best possible results
      timeout: 10000,         // Maximum time (in milliseconds) to wait for a location
      maximumAge: 0          // Maximum age (in milliseconds) of a cached position allowed
                             // 0 means don't use a cached position
    };

    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
      console.log("Getting Location!");
    }
  });
}



export default function MapView() {
  const [center, setCenter] = useState({lat: 37.334665328, lng: -121.875329832}); // Default to SJSU
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'annular-primer-458021-q3',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '', 
  });

  const onLoad = useCallback(function callback(map: google.maps.Map | null) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    if (map) {
      map.fitBounds(bounds);
      map.panTo(center);
      setMap(map);
    }
  }, [center]);


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
       map.setZoom(10);
    }
  }, [center, map]);
  //const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const position = await getUserLocation();
        setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
      } catch (error) {
        console.error('Error getting location:', error);
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
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      //onCenterChanged={onCenterChange}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

