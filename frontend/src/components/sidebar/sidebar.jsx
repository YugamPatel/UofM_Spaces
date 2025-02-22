import React from "react";
import { useState, useEffect } from "react";
import { spaces } from "../../Data/Test";
import Card from "./card/card";
import "../sidebar/sidebar.css";
import DateComponent from "../Date/Date";
import { getNearestBusStopWinnipeg } from "../../helperFunctions/mapHelpers";

// Receive onCardClick from props
function Sidebar({ onCardClick }) {
  const [spacesState, setSpacesState] = useState(spaces);
  useEffect(() => {
    // For each space, fetch nearest bus stop and replace the "location" field
    async function enrichSpacesWithBusStop() {
      const updated = await Promise.all(
        spaces.map(async (space) => {
          const coords = space.coordinates;
          if (!coords || coords.length < 2) {
            return space;
          }

          const [lat, lng] = coords;
          const stop = await getNearestBusStopWinnipeg(lat, lng, 250);

          if (stop) {
            console.log("Found stop:", stop);
            const distanceStr = `${stop.distance.toFixed(1)}m`;
            return {
              ...space,
              location: `${stop.name} (${distanceStr})`,
            };
          } else {
            return {
              ...space,
              location: space.location,
            };
          }
        })
      );
      setSpacesState(updated);
    }

    enrichSpacesWithBusStop();
  }, []);

  return (
    <>
      <div className="outer-body">
        <div className="inner-body">
          <img
            src="https://res.cloudinary.com/dsetoffh9/image/upload/v1740193664/universite-manitoba_uswpl2.png"
            className="uni-img"
          />
          <h1 className="title">Spaces</h1>
        </div>

        <DateComponent />
        {spacesState.map((space, index) => {
          return (
            <Card
              key={index}
              {...space}
              onClick={() => onCardClick(space.coordinates)}
            />
          );
        })}
      </div>
    </>
  );
}

export default Sidebar;
