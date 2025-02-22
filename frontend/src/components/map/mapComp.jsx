import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapComp.css";
import { spaces } from "../../Data/Test";
import {
  checkIfOpen,
  highlightSpaceCard,
  getUserLocation,
} from "../../helperFunctions/mapHelpers";

// Replace this with your own Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoieXVnYW0tMDA3IiwiYSI6ImNtN2Y5dnB2bjBoODYybW44MDRtYXZqcjAifQ.b9U8tqIEN8w3HQYTO9ZqBA";

/**
 * Adds a marker to the map at the specified coordinates.
 * @param {mapboxgl.Map} map - The Mapbox map instance.
 * @param {Object} space - The space object (coordinates, name, timings, etc.).
 */
const addMarker = (map, space) => {
  const markerDiv = document.createElement("div");
  // data is [lat, lng], Mapbox needs [lng, lat]
  const [lat, lng] = space.coordinates;

  // Class based on open/closed
  markerDiv.className =
    space.isCollapsable || checkIfOpen(space.timings) === "Open"
      ? "marker-open"
      : "marker-closed";

  // Click event: highlight card
  markerDiv.addEventListener("click", () => highlightSpaceCard(space));

  // Add marker to the map
  new mapboxgl.Marker(markerDiv).setLngLat([lng, lat]).addTo(map);
};

/**
 * Generate a zoom-based interpolation array (used for "snow" density, etc.).
 * @param {number} value - The target value at a certain zoom level.
 */
const zoomBasedReveal = (value) => [
  "interpolate",
  ["linear"],
  ["zoom"],
  11,
  0.0,
  13,
  value,
];

const MapComp = ({ selectedCoordinates }) => {
  /** Default map settings */
  const DEFAULT_CENTER = [-97.13283, 49.80958]; // [lng, lat]
  const DEFAULT_ZOOM = 17.18;
  const DEFAULT_PITCH = 65;
  const DEFAULT_BEARING = 28;

  // We'll store the origin in state; defaults to the center, updated with user's location
  const [ORIGIN, setOrigin] = useState(DEFAULT_CENTER);

  // Map state for debugging or future usage
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pitch, setPitch] = useState(DEFAULT_PITCH);
  const [bearing, setBearing] = useState(DEFAULT_BEARING);

  // Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  /**
   * Remove existing route layers/sources (named route-X).
   */
  const removeRoutes = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const allLayers = map.getStyle().layers || [];
    const allSources = map.getStyle().sources || {};

    // Remove layers named "route-line-X"
    allLayers.forEach((layer) => {
      if (layer.id.startsWith("route-line-")) {
        map.removeLayer(layer.id);
      }
    });

    // Remove sources named "route-X"
    Object.keys(allSources).forEach((sourceId) => {
      if (sourceId.startsWith("route-")) {
        map.removeSource(sourceId);
      }
    });
  };

  /**
   * Fetch multiple routes from the Directions API (using "driving" instead of "driving-traffic").
   * Then add them as line layers on the map.
   */
  const showRoutes = async (origin, destination) => {
    if (!mapRef.current) return;

    // Both origin and destination must be [lng, lat]
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?alternatives=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes) {
        console.error("No routes found:", data);
        return;
      }

      // Remove old routes first
      removeRoutes();

      data.routes.forEach((route, index) => {
        const routeGeoJSON = {
          type: "Feature",
          properties: {
            distance: route.distance,
            duration: route.duration,
          },
          geometry: route.geometry,
        };

        const sourceId = `route-${index}`;
        mapRef.current.addSource(sourceId, {
          type: "geojson",
          data: routeGeoJSON,
        });

        mapRef.current.addLayer({
          id: `route-line-${index}`,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": index === 0 ? "#ff5c5c" : "#0092ff",
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });
      });
    } catch (err) {
      console.error("Error fetching directions:", err);
    }
  };

  /**
   * Reset the map to defaults and remove any routes.
   */
  const resetMap = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      essential: true,
      duration: 2000,
    });
    removeRoutes();
  };

  /**
   * Initialize the map (only once).
   */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      antialias: true,
      projection: "globe",
    });

    mapRef.current.on("load", () => {
      const map = mapRef.current;
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id;

      // Example config property usage (some might be experimental)
      map.setConfigProperty("basemap", "lightPreset", "dusk");
      map.setConfigProperty("basemap", "showPlaceLabels", true);
      map.setConfigProperty("basemap", "showPointOfInterestLabels", true);
      map.setConfigProperty("basemap", "showRoadLabels", true);
      map.setConfigProperty("basemap", "showTransitLabels", true);

      // Add 3D buildings layer
      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              "#F8F9FA",
              50,
              "#999",
              100,
              "#705D56",
              200,
              "#5A4A42",
              400,
              "#453C34",
              600,
              "#2F2925",
            ],
            "fill-extrusion-emissive-strength": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0.2,
              20,
              0.8,
            ],
            "fill-extrusion-lighting-directional": 1,
            "fill-extrusion-lighting-intensity": 1.2,
            "fill-extrusion-ambient-occlusion-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0.5,
              20,
              1.2,
            ],
            "fill-extrusion-ambient-occlusion-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              4,
              20,
              10,
            ],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.98,
          },
        },
        labelLayerId
      );

      // Set atmospheric effects (snow)
      map.setSnow({
        density: zoomBasedReveal(0.85),
        intensity: 0.8,
        "center-thinning": 0.1,
        direction: [0, 50],
        opacity: 0.6,
        color: "#ffffff",
        "flake-size": 0.71,
        vignette: zoomBasedReveal(0.3),
        "vignette-color": "#ffffff",
      });
    });

    // Add markers for each space
    spaces.forEach((space) => {
      addMarker(mapRef.current, space);
    });

    // Track camera changes
    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
      setPitch(mapRef.current.getPitch());
      setBearing(mapRef.current.getBearing());
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /**
   *  If the user selects a location from a card:
   *   - Fly the map there
   *   - Show driving routes from ORIGIN to that location
   */
  useEffect(() => {
    if (selectedCoordinates && mapRef.current) {
      // Data is [lat, lng], convert to [lng, lat] for the map/directions
      const [lat, lng] = selectedCoordinates;

      // 1) Fly the map
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 18.5,
        pitch: 50,
        bearing: -20,
        duration: 2000,
        essential: true,
      });

      // 2) Show routes from ORIGIN -> [lng, lat]
      const destination = [lng, lat];
      showRoutes(ORIGIN, destination);
    }
  }, [selectedCoordinates, ORIGIN]);

  /**
   * On mount, fetch the user's location and set it as ORIGIN.
   */
  useEffect(() => {
    const fetchUserLocation = async () => {
      const userLocation = await getUserLocation();
      // userLocation will be [lat, lng], but we want [lng, lat] internally
      const [uLat, uLng] = userLocation;
      // Switch to [lng, lat] for ORIGIN
      setOrigin([uLng, uLat]);
    };
    fetchUserLocation();
  }, []);

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
