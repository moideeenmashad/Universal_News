// import React from "react";
import { SlGlobe } from "react-icons/sl";

const PreNavabar = () => {
  const Today = new Date().toDateString();
  return (
    <div className="flex items-center">
      <SlGlobe />
      <p className="date">{Today}</p>
    </div>
  );
};

export default PreNavabar;
