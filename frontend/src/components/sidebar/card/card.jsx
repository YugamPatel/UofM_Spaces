
import React, { useState } from "react";
import "./card.css";

function Card({ name, description, image, isCollapsable,location, timings }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const isOpen = (timings) => {
        if (!timings) return "Closed";
    
        const [start, end] = timings.split(" - ");
    
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);
        const startTime = startHours * 60 + startMinutes;
        const endTime = endHours * 60 + endMinutes;
    
        return currentTime >= startTime && currentTime <= endTime ? "Open" : "Closed";
    };
    

    return (
        <>
            {!isCollapsable && (
                <div className="outer-card">
                    <div className="card-image">
                        <img src={image} className="image" alt={name} />
                    </div>
                    <div className="name">
                        <h2>{name}</h2>
                    </div>
                    <div className="description">
                        <p>{description}</p>
                    </div>
                    {isOpen(timings) === "Closed" && 
                    <div className="status-closed">
                        <img className="status-icon" src="https://img.icons8.com/?size=100&id=10247&format=png&color=FFFFFF"></img>
                        <p> Closed</p>
                    </div>
                    }
                    {isOpen(timings) === "Open" && 
                    <div className="status-open">
                        <img className="status-icon" src="https://img.icons8.com/?size=100&id=10247&format=png&color=FFFFFF"></img>
                        <p> Open</p>
                    </div>
                    }
                    <div className="location">
                        <img className="status-icon" src="https://img.icons8.com/?size=100&id=9361&format=png&color=FFFFFF"></img>
                        <p> {location}</p>
                    </div>
                    <div className="timings">
                        <p>Timings: {timings}</p>
                    </div>
                </div>
            )}

            {isCollapsable && (
                <div className={`outer-card ${isExpanded ? "expanded" : ""}`}>
                    <div className="top-display">
                        <div className="name">
                            <h2>{name}</h2>
                        </div>
                        <div className="icon" onClick={toggleExpand}>
                            <img
                                src={
                                    isExpanded
                                        ? "https://img.icons8.com/?size=100&id=1504&format=png&color=000000"
                                        : "https://img.icons8.com/?size=100&id=24717&format=png&color=000000"
                                }
                                className="icon"
                                alt="Expand Icon"
                            />
                        </div>
                    </div>

                    <div className={`collapsible-content ${isExpanded ? "show" : "hide"}`}>
                        <div className="card-image">
                            <img src={image} className="image" alt={name} />
                        </div>
                        <div className="description">
                            <p>{description}</p>
                        </div>
                        <div className="timing-header">Timings:</div>
                        {timings.map((time, i) => (
                            <div key={i} className="timings">
                                <p>{time.time} : {time.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Card;
