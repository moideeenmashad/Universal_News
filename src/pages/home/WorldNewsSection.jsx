import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns"; // Import date-fns for formatting
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";

const WorldNewsSection = ({ title, articleUrlName }) => {
  const [articles, setArticles] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}`;
 console.log(API_KEY)


  const getLatestNews = () => {
    axios
      .get(API_URL)
      .then((response) => {
        const data = response.data;

        const firstSix = data.articles.slice(1, 8);
        setArticles(firstSix);
        console.log("Latest News", firstSix);
      })
      .catch((error) => {
        console.error("Error fetching latest news:", error);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasLoaded) {
          getLatestNews();
          setHasLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasLoaded]);
  return (
    <div className="mx-auto max-w-screen-xl mb-[100px]" ref={containerRef}>
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        {/* <hr className="border-t-2 border-gray-300 mx-4" /> */}
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" to="/world-news">
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
        {/* Main Grid Item with Image and Overlay */}
        <div className="md:row-span-3 md:col-span-2">
          <div className="overflow-hidden rounded-sm relative">
            {articles[1]?.urlToImage ? (
              <img
                src={articles[1].urlToImage}
                alt={articles[1].title || "news thumbnail"}
                className="w-full h-[520px] object-cover hover:scale-105 ease-in-out transition-transform duration-300"
              />
            ) : (
              <div className=" h-[520px] w-full rounded-sm animate-pulse"></div>
            )}
            {/* Overlay Card */}
            <div className="absolute top-4 left-4 right-4 p-4 rounded-sm md:w-1/2 bottom-4 grid bg-primary">
              <div className="">
                <p className="text-xs px-5 py-2 bg-teritory w-fit rounded-lg text-light mb-[12px]">
                  {articles[1]?.publishedAt ? (
                    format(new Date(articles[1].publishedAt), "MMM d, yyyy")
                  ) : (
                    <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                  )}
                </p>
                <p className="text-primary fw-500 text-[26px]">
                  {articles[1]?.title ? (
                    articles[1].title
                  ) : (
                    <span className="h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                  )}
                </p>
              </div>
              <p className="text-sm fw-400">
                <span>By.</span>
                <span>
                  {articles[1]?.author ? (
                    " " + articles[1].author + " / "
                  ) : (
                    <span className="h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
                  )}
                </span>
                <span>Publisher</span>
              </p>
            </div>
          </div>
        </div>

        {articles.length > 0
          ? articles.slice(0, 3).map((article, index) => (
              <div
                key={index}
                className="grid items-center gap-4 [grid-template-columns:40%_60%]"
              >
                {/* 40% for Image */}
                <div className="image-container mr-[8px] overflow-hidden rounded-sm relative">
                  {article?.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-auto aspect-square object-cover object-center 
                             hover:scale-105 ease-in-out transition-transform duration-300 rounded-sm"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-300 animate-pulse rounded-sm"></div>
                  )}
                </div>

                {/* 60% for Title/Info */}
                <div>
                  <p className="text-xs text-primary flex items-center">
                    <span>{article?.author || "Unknown Author"}</span>
                    <span className="mx-1">—</span>
                    <span>
                      {article?.publishedAt
                        ? format(new Date(article.publishedAt), "MMM d, yyyy")
                        : "Date Unavailable"}
                    </span>
                  </p>
                  <p className="fw-500 text-[18px] mt-1">
                    {article?.title ? (
                      article.title.length > 30 ? (
                        article.title.slice(0, 30) + "..."
                      ) : (
                        article.title
                      )
                    ) : (
                      <span className="block h-4 w-2/3 bg-gray-300 animate-pulse rounded-sm"></span>
                    )}
                  </p>
                </div>
              </div>
            ))
          : // Placeholder UI for loading state
            [...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center">
                {/* Placeholder Image */}
                <div className="w-[182px] h-[182px] bg-gray-300 animate-pulse rounded-sm mr-[8px]"></div>

                {/* Placeholder Text */}
                <div>
                  <p className="text-xs text-primary flex items-center">
                    <span className="h-4 w-20 bg-gray-300 animate-pulse rounded-sm block"></span>{" "}
                    -
                    <span className="h-4 w-16 bg-gray-300 animate-pulse rounded-sm block ml-1"></span>
                  </p>
                  <p className="fw-500 text-[18px] mt-[12px]">
                    <span className="h-4 w-2/3 bg-gray-300 animate-pulse rounded-sm block"></span>
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default WorldNewsSection;
