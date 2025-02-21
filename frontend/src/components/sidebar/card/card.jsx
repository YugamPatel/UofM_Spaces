import React from "react";
import "./card.css"

function Card(data = {}) {
    
    return (
        <>
            <div className="outer-card">
                <div className="card-image">
                    <img src={data.image} className="image"/>
                </div>
                <div className="name">
                    <h2>{data.name}</h2>
                </div>
                <div className="description">
                    <p>{data.description}</p>
                </div>
                <div className="timings">
                    <p>Timings: {data.timings}</p>
                </div>
            </div>
        </>
    )
}

export default Card;