
import React, { useState } from "react";
import "./card.css";
import { isOpen } from "../../../helperFunctions/isOpen";

function Card({ name, description, image, isCollapsable,location, timings, onClick }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    return (
        <>
            {!isCollapsable && (
                <div className="outer-card" onClick={onClick}>
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
                <div className={`outer-card ${isExpanded ? "expanded" : ""}`} onClick={onClick}>
                    <div className="top-display">
                        <div className="name">
                            <h2>{name}</h2>
                        </div>
                        <div className="icon" onClick={toggleExpand}>
                            <img
                                src={
                                    isExpanded
                                        ? "https://img.icons8.com/?size=100&id=37839&format=png&color=FFFFFF"
                                        : "https://img.icons8.com/?size=100&id=11206&format=png&color=FFFFFF"
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
