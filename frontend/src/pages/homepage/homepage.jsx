import React, { useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import MapComp from "../../components/map/mapComp";
import "../homepage/homepage.css";

const Homepage = () => {
  // State for the location the user clicks (from a card)
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  // This callback will receive coordinates from a card click
  const handleCardClick = (coords) => {
    setSelectedCoordinates(coords); 
  };

  return (
    <div id="homepage">
      {/* Pass the callback to the Sidebar */}
      <Sidebar onCardClick={handleCardClick} />
      {/* Pass the selectedCoordinates to the Map */}
      <MapComp selectedCoordinates={selectedCoordinates} />
    </div>
  );
};

export default Homepage;
