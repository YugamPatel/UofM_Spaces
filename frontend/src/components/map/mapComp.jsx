import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapComp.css";

// Replace with your own Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoieXVnYW0tMDA3IiwiYSI6ImNtN2Y5dnB2bjBoODYybW44MDRtYXZqcjAifQ.b9U8tqIEN8w3HQYTO9ZqBA";

const MapComp = () => {
  // Default map parameters
  const DEFAULT_CENTER = [-97.1384, 49.8951]; // Winnipeg, MB
  const DEFAULT_ZOOM = 15; // Zoomed in enough for 3D
  const DEFAULT_PITCH = 45;
  const DEFAULT_BEARING = -17.6;

  // Store map parameters in state
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [bearing, setBearing] = useState(DEFAULT_BEARING);

  // Refs
  const mapContainerRef = useRef(null); // DOM node for map
  const mapRef = useRef(null); // Mapbox map instance

  // Initialize map only once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      antialias: true,
    });

    // Once the style loads, add a 3D buildings layer
    mapRef.current.on("load", () => {
      // Find the first label layer in the style (to place our 3D layer underneath it)
      const layers = mapRef.current.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id;

      // Add 3D buildings layer (fill-extrusion)
      mapRef.current.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 1,
          },
        },
        labelLayerId
      );
    });

    // Listen for map movements to update state (optional)
    mapRef.current.on("move", () => {
      if (!mapRef.current) return;
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
      setPitch(mapRef.current.getPitch());
      setBearing(mapRef.current.getBearing());
    });

    // Add a sample marker at the default center (Winnipeg)
    const markerEl = document.createElement("div");
    markerEl.className = "marker"; // See .marker style in your CSS

    new mapboxgl.Marker(markerEl)
      .setLngLat(DEFAULT_CENTER)
      .addTo(mapRef.current);

    // Cleanup on unmount
    return () => {
      mapRef.current && mapRef.current.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly back to default view
  const resetMap = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      essential: true,
      duration: 2000, // ms
    });
  };

  return (
    <div className="map-wrapper">
      <div className="map-container" ref={mapContainerRef} />
      <div className="map-controls">
        <button onClick={resetMap} className="map-button">
          Reset Map
        </button>
      </div>
    </div>
  );
};

export default MapComp;
