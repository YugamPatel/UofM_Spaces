import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapComp.css";
import { spaces } from "../../Data/Test";
import { isOpen } from "../../helperFunctions/isOpen";

// Replace with your own Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoieXVnYW0tMDA3IiwiYSI6ImNtN2Y5dnB2bjBoODYybW44MDRtYXZqcjAifQ.b9U8tqIEN8w3HQYTO9ZqBA";

const MapComp = ({ selectedCoordinates }) => {
  // Default map parameters
  const DEFAULT_CENTER = [-97.13283, 49.80958];
  const DEFAULT_ZOOM = 17; // Zoomed in enough for 3D
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

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      antialias: true,
      projection: "globe",
    });

    // Once the style loads, add a 3D buildings layer
    mapRef.current.on("load", () => {
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

    spaces.forEach((space) => {
      const [lat, lng] = space.coordinates; // data is [lat, lng]
      const markerDiv = document.createElement("div");

      if (!space.isCollapsable && isOpen(space.timings) === "Closed") {
        markerDiv.className = "marker-closed";
      } else {
        markerDiv.className = "marker-open"; // style in MapComp.css, e.g. small circle
      }

      // Create a Mapbox Marker
      new mapboxgl.Marker(markerDiv)
        .setLngLat([lng, lat]) // reversing: Mapbox wants [lng, lat]
        .addTo(mapRef.current);
    });

    // Update state on map movements
    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
      setPitch(mapRef.current.getPitch());
      setBearing(mapRef.current.getBearing());
    });

    // Cleanup
    return () => {
      mapRef.current && mapRef.current.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    // If selectedCoordinates changes, fly the map
    if (selectedCoordinates && mapRef.current) {
      const [lat, lng] = selectedCoordinates;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 18.5,
        pitch: 50,
        bearing: -20,
        duration: 2000,
        essential: true,
      });
    }
  }, [selectedCoordinates]);

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
