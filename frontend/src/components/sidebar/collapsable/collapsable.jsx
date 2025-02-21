import React, { useState } from "react";
import "./collapsable.css";
import { individual } from "../../../Data/Collapsable";

function Collapsable() {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Toggle individual items
    };
    console.log(individual[0].timings);
    

    return (
        <>
            {individual.map((data, index) => (
                <div key={index} className={`outer-card ${expandedIndex === index ? "expanded" : ""}`}>
                    <div className="top-display">
                        <div className="name">
                            <h2>{data.name}</h2>
                        </div>
                        <div className="icon" onClick={() => toggleExpand(index)}>
                            <img 
                                src={
                                    expandedIndex === index 
                                    ? "https://img.icons8.com/?size=100&id=1504&format=png&color=000000" 
                                    : "https://img.icons8.com/?size=100&id=24717&format=png&color=000000"
                                } 
                                className="icon"
                            />
                        </div>
                    </div>

                    <div className={`collapsible-content ${expandedIndex === index ? "show" : "hide"}`}>
                        <div className="card-image">
                            <img src={data.image} className="image" alt={data.name} />
                        </div>
                        <div className="description">
                            <p>{data.description}</p>
                        </div>
                        <div className="timing-header">Timings: </div>                        
                        {data.timings.map((time, i) => (
                            
                            <div key={i} className="timings">
                                <p>{time.time} : {time.status}</p>
                                
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}

export default Collapsable;
