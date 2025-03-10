import React, { useEffect, useState } from "react";
import "./card.css";
import { checkIfOpen } from "../../../helperFunctions/mapHelpers";

function Card({
  name,
  description,
  image,
  isCollapsable,
  location,
  coordinates,
  timings,
  onClick,
}) {
    const [day, setDay] = useState("")
  const [isExpanded, setIsExpanded] = useState(false);
  const cardId = `card-${name.replace(/\s+/g, "-")}`;

useEffect(() => {
console.log(typeof(timings));
if(typeof(timings) === "string"){
    const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }); // Example: "Monday"
  if(currentDay === "Saturday"){
    const toSet = timings.split("\n")[1];
    setDay(toSet);
  }
}

})

  const toggleExpand = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    setIsExpanded(!isExpanded);
  };

  const maps = (e) => {
    e.stopPropagation();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const userLat = coordinates[0];
            const userLng = coordinates[1];
            const url =      `https://www.google.com/maps/dir/${lat},${lng}/${userLat},${userLng}/`;   
            window.open(url, '_blank');
        },
    (error) => {
        console.log("Error in Location fetching");
        
    })
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div
      className={`outer-card ${isExpanded ? "expanded" : ""}`}
      id={cardId}
      onClick={onClick}
    >
      <div className="top-display">
        <div className="name">
          <h2>{name}</h2>
        </div>
        {isCollapsable && (
          <div className="icon" onClick={toggleExpand}>
            <img
              src={
                !isExpanded
                  ? "https://img.icons8.com/?size=100&id=37839&format=png&color=FFFFFF"
                  : "https://img.icons8.com/?size=100&id=11206&format=png&color=FFFFFF"
              }
              className="icon"
              alt="Expand Icon"
            />
          </div>
        )}
      </div>

      {/* Image Section (Always Present) */}
      <div className="card-image">
        <img src={image} className="image" alt={name} />
      </div>

      {/* Description */}
      <div className="description">
        <p>{description}</p>
      </div>

      {/* Open/Closed Status */}
      {typeof timings === "string" && (
        <>
          {checkIfOpen(timings) === "Closed" && (
            <div className="status-closed">
              <img
                className="status-icon"
                src="https://img.icons8.com/?size=100&id=10247&format=png&color=FFFFFF"
                alt="Closed Icon"
              />
              <p> Closed</p>
            </div>
          )}
          {checkIfOpen(timings) === "Open" && (
            <div className="status-open">
              <img
                className="status-icon"
                src="https://img.icons8.com/?size=100&id=10247&format=png&color=FFFFFF"
                alt="Open Icon"
              />
              <p> Open</p>
            </div>
          )}
        </>
      )}

      {/* Location (Always Present) */}
      <div className="location">
        <img
          className="status-icon"
          src="https://img.icons8.com/?size=100&id=9361&format=png&color=FFFFFF"
          alt="Location Icon"
        />
        <p>{location}</p>
      </div>
      <div className="get-location">
        <button className="loc-btn" onClick={maps}>
        Get Location
        </button>
      </div>

      {/* Timings */}
      {typeof timings === "string" && (
        <div className="timings">
          <p>Timings: {day}</p>
        </div>
      )}

      {/* Collapsible Content */}
      {isCollapsable && (
        <div className={`collapsible-content ${isExpanded ? "show" : "hide"}`}>
          <div className="timing-header" style={{ color: "white" }}>
            Timings:
          </div>
          {Array.isArray(timings) &&
            timings.map((time, i) => (
              <div key={i} className="timings">
                <p>
                  {time.time} : {time.status}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Card;
