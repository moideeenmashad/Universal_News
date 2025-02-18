// import React from "react";
import { SlGlobe } from "react-icons/sl";
import { GoSearch, GoChevronRight } from "react-icons/go";
import "./Navbar.css";
const PreNavabar = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="pre-navbar-container max-w-screen-xl mx-auto px-4 flex justify-between items-center border-primary border-y-2 my-2">
      <div className="flex items-center pb-2 pt-2 space-x-1">
        <SlGlobe />
        <p className="text-primary">{today}</p>
      </div>
      <div className="flex items-center pb-2 pt-2 space-x-2">
        <p className="text-primary">The Menu</p>
        <GoChevronRight />
        <GoSearch />
      </div>
    </div>
  );
};

export default PreNavabar;
