// import React from "react";

import Featured from "./Featured";
import LatestNews from "./LatesNews";
import LiveArticle from "./LiveArticle";

// import Navbar from "@/components/layouts/Navbar/Navbar";
const WorldNews = () => {
  const sectionTitle = ["Latest News"];
  return (
    <>
      <section className="gap-x-[100px]">
        <Featured />
        <LiveArticle />
        <LatestNews title={sectionTitle[0]} />
      </section>
    </>
  );
};

export default WorldNews;
