import React from "react";
import { spaces } from "../../Data/Test";
import Card from "./card/card";
import "../sidebar/sidebar.css";
import Collapsable from "./collapsable/collapsable";

function Sidebar() {
  return (
    <>
      <div className="outer-body">
        <h1 className="title">Spaces</h1>
        {spaces.map((space) => {
          return <Card {...space} />;
        })}
        <Collapsable />
      </div>
    </>
  );
}

export default Sidebar;
