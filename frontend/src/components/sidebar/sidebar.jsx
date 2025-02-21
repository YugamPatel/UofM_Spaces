import React from "react";
import { spaces } from "../../Data/Test";
import Card from "./card/card";
import "../sidebar/sidebar.css";

function Sidebar() {
  return (
    <>
      <div className="outer-body">
        {spaces.map((space) => {
          return <Card {...space} />;
        })}
      </div>
    </>
  );
}

export default Sidebar;
