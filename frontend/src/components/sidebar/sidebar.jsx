import React from "react";
import { spaces } from "../../Data/Test";
import Card from "./card/card";
import "../sidebar/sidebar.css"
import DateComponent from "../Date/Date";

// Receive onCardClick from props
function Sidebar({ onCardClick }) {
  return (
    <>
      <div className="outer-body">
        <div className="inner-body">
        <img src="https://res.cloudinary.com/dsetoffh9/image/upload/v1740193664/universite-manitoba_uswpl2.png" className="uni-img"/>
        <h1 className="title">Spaces</h1>
        </div>
        
        <DateComponent />
        {spaces.map((space, index) => {
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
