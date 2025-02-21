import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your token

const MapComponent = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/dark-v11", // Dark theme
            center: [-97.1339, 49.8084], // Example coordinates (adjust as needed)
            zoom: 15,
            pitch: 45, // Tilt the map for a 3D effect
            bearing: -17.6, // Angle of rotation
            antialias: true // Better rendering quality
        });

        // Add 3D Buildings Layer
        map.on("load", () => {
            map.addLayer({
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                    "fill-extrusion-color": "#2d2d2d",
                    "fill-extrusion-height": ["get", "height"],
                    "fill-extrusion-opacity": 0.8
                }
            });

            // Add glowing green markers
            const locations = [
                [-97.1339, 49.8084], 
                [-97.1317, 49.8102] // Add more coordinates here
            ];

            locations.forEach(coord => {
                new mapboxgl.Marker({
                    color: "#00ff00", // Green glowing dots
                    scale: 1.5
                })
                .setLngLat(coord)
                .addTo(map);
            });
        });

        return () => map.remove();
    }, []);

    return <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MapComponent;
