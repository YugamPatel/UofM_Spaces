import Sidebar from "../../components/sidebar/sidebar";
import "../homepage/homepage.css";
import React from "react";
// import MapComp from "../../components/map/mapComp";


const homepage = () => {
  return <div id="homepage">
    <h1>Homepage</h1>
    <p>Welcome to the homepage!</p>
    <Sidebar />
    {/* <MapComp /> */}
  </div>;
};

export default homepage;
