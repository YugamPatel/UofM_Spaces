import React from "react";
import { spaces } from "../../Data/Test";
import Card from "./card/card";
import "../sidebar/sidebar.css";
import "./collapsable/collapsable.css"
import DateComponent from "../Date/Date";

function Sidebar() {
  return (
    <>
      <div className="outer-body">
        <h1 className="title">Spaces</h1>
        <DateComponent />
        {spaces.map((space, index) => {
          return <Card key={index} {...space} />;
        })}
        
      </div>
    </>
  );
}

export default Sidebar;
