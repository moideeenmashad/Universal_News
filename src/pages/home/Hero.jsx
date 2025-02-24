// import React from "react";

import Featured from "./Featured";
import LatestNews from "./LatestNews";
import LiveArticle from "./LiveArticle";

// import Navbar from "@/components/layouts/Navbar/Navbar";
const WorldNews = () => {
  const sectionTitle = ["Latest News"];
  // const published = ;
  return (
    <>
      <section className="">
        <Featured className="" />
        <LiveArticle className="" />
        <LatestNews title={sectionTitle[0]} />
      </section>
    </>
  );
};

export default WorldNews;
