import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const MAJOR_CITIES = [
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi", lat: 28.6139, lng: 77.2090 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

interface WizardMapProps {
  location: { lat: number; lng: number; radiusBase: number; city?: string };
  setLocation: (loc: any) => void;
  googleMapsApiKey: string;
}

export default function WizardMap({ location, setLocation, googleMapsApiKey }: WizardMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(5);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Smoothly pan and zoom when location changes
  useEffect(() => {
    if (map && location.lat && location.lng) {
      map.panTo({ lat: location.lat, lng: location.lng });
      // If a city is selected, zoom in
      if (location.city) {
        setZoom(12);
      }
    }
  }, [location.lat, location.lng, location.city, map]);

  const handleCityClick = (cityData: any) => {
    console.log("City selected:", cityData.city);
    setLocation({
      lat: cityData.lat,
      lng: cityData.lng,
      city: cityData.city,
      radiusBase: location.radiusBase || 5
    });
  };

  return isLoaded ? (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Cities of India</p>
          <p className="text-xs text-slate-500">Click a marker to select</p>
        </div>
        
        {location.city && (
          <div className="bg-primary-600 text-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold self-start animate-in fade-in slide-in-from-top-1 scale-110 origin-left transition-transform">
            Selected: {location.city}
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: location.lat, lng: location.lng }}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onZoomChanged={() => {
          if (map) {
            const newZoom = map.getZoom();
            if (newZoom !== undefined && newZoom !== zoom) {
              setZoom(newZoom);
            }
          }
        }}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* The Active Selection Marker */}
        {location.lat && location.lng && (
          <Marker 
            position={{ lat: location.lat, lng: location.lng }}
            zIndex={1000}
            animation={google.maps.Animation.DROP}
          />
        )}

        {/* City Choice Markers (smaller) */}
        {MAJOR_CITIES.map((cityData) => (
          <Marker
            key={cityData.city}
            position={{ lat: cityData.lat, lng: cityData.lng }}
            onClick={() => handleCityClick(cityData)}
            title={cityData.city}
            opacity={location.city === cityData.city ? 0 : 0.7}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(32, 32)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
      <p className="text-slate-400">Loading Map...</p>
    </div>
  );
}
