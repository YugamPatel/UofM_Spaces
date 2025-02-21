import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./mapComp.css";

const MapComp = () => {
  const mapContainerRef = useRef(null);

  // 🔑 Replace this with your Mapbox Access Token
  mapboxgl.accessToken =
    "pk.eyJ1IjoieXVnYW0tMDA3IiwiYSI6ImNtN2Y5dnB2bjBoODYybW44MDRtYXZqcjAifQ.b9U8tqIEN8w3HQYTO9ZqBA";

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Reference to the map container
      style: "mapbox://styles/mapbox/navigation-night-v1", // Map style (change if needed)
      center: [-97.1384, 49.8951], // Default center (Winnipeg, MB)
      zoom: 10, // Default zoom level
      pitch: 45, // Pitch
      bearing: -17.6, // Bearing
      antialias: true, // Antialiasing
    });
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    return () => map.remove();
  }, []);

  return (
    <div className="map-container">
      <div className="map" ref={mapContainerRef}></div>
    </div>
  );
};

export default MapComp;
