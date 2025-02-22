import React, { useState } from "react";
import "./card.css";
import { isOpen } from "../../../helperFunctions/isOpen";

function Card({
  name,
  description,
  image,
  isCollapsable,
  location,
  timings,
  onClick,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardId = `card-${name.replace(/\s+/g, "-")}`;

  const toggleExpand = (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`outer-card ${isExpanded ? "expanded" : ""}`}
      id={cardId}
      onClick={onClick}
    >
      {/* Name and Expand Icon for collapsible cards */}
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
          {isOpen(timings) === "Closed" && (
            <div className="status-closed">
              <img
                className="status-icon"
                src="https://img.icons8.com/?size=100&id=10247&format=png&color=FFFFFF"
                alt="Closed Icon"
              />
              <p> Closed</p>
            </div>
          )}
          {isOpen(timings) === "Open" && (
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

      {/* Timings */}
      {typeof timings === "string" && (
        <div className="timings">
          <p>Timings: {timings}</p>
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

