// import React from "react";
// import "./card.css"

// function Card(data = {}) {
//     console.log(data);
    
//     return (
//         <>{!data.isCollapsable && 
//             <div className="outer-card">
//             <div className="card-image">
//                 <img src={data.image} className="image"/>
//             </div>
//             <div className="name">
//                 <h2>{data.name}</h2>
//             </div>
//             <div className="description">
//                 <p>{data.description}</p>
//             </div>
//             <div className="timings">
//                 <p>Timings: {data.timings}</p>
//             </div>
//         </div>}

//         {data.isCollapsable && 
//         <div key={index} className={`outer-card ${expandedIndex === index ? "expanded" : ""}`}>
//         <div className="top-display">
//             <div className="name">
//                 <h2>{data.name}</h2>
//             </div>
//             <div className="icon" onClick={() => toggleExpand(index)}>
//                 <img 
//                     src={
//                         expandedIndex === index 
//                         ? "https://img.icons8.com/?size=100&id=1504&format=png&color=000000" 
//                         : "https://img.icons8.com/?size=100&id=24717&format=png&color=000000"
//                     } 
//                     className="icon"
//                 />
//             </div>
//         </div>

//         <div className={`collapsible-content ${expandedIndex === index ? "show" : "hide"}`}>
//             <div className="card-image">
//                 <img src={data.image} className="image" alt={data.name} />
//             </div>
//             <div className="description">
//                 <p>{data.description}</p>
//             </div>
//             <div className="timing-header">Timings: </div>                        
//             {data.timings.map((time, i) => (
                
//                 <div key={i} className="timings">
//                     <p>{time.time} : {time.status}</p>
                    
//                 </div>
//             ))}
//         </div>
//     </div>
//         }
            
//         </>
//     )
// }

// export default Card;

import React, { useState } from "react";
import "./card.css";

function Card({ name, description, image, isCollapsable, timings }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
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
