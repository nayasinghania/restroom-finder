"use client";

import { useEffect, useState, useCallback } from "react";
//import { MapPin } from "lucide-react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';


async function getUserLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    

    const options = {
      enableHighAccuracy: false,  // faster, “coarse” location
      timeout:        30000,      // wait up to 30 s
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

  const { isLoaded } = useJsApiLoader({
    id: 'annular-primer-458021-q3',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY || '', 
  });

  const onLoad = useCallback(function callback(map: google.maps.Map | null) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // if (map) {
    //   map.fitBounds(bounds);
      setMap(map);
      map.setZoom(15);
    
  }, []);


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
          // retry without high‐accuracy and a short timeout
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
      //onCenterChanged={onCenterChange}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

