// import React from "react";

import Featured from "./Featured";
import LatestNews from "./LatestNews";
import LiveArticle from "./LiveArticle";

// import Navbar from "@/components/layouts/Navbar/Navbar";
const WorldNews = () => {
  const sectionTitle = ["Latest News"];
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  };
  // const published = ;
  return (
    <>
      <section className="">
        <Featured className="" />
        <LiveArticle className="" articleUrlName={slugify} />
        <LatestNews title={sectionTitle[0]} articleUrlName={slugify} />
      </section>
    </>
  );
};

export default WorldNews;
