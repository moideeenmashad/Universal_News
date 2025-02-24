import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // Import date-fns for formatting
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
const LatestNews = ({ title }) => {
  const [articles, setArticles] = useState([]);
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        const data = response.data;
        if (data.articles) {
          // Keep only the first 6 articles
          const firstSix = data.articles.slice(1, 8);
          setArticles(firstSix);
        }
      })
      .catch((error) => {
        console.error("Error fetching latest news:", error);
      });
  }, []);

  // const formattedDate = format(
  //   new Date(article.publishedAt),
  //   "EEEE, MMMM d, yyyy"
  // );

  return (
    <div className="mx-auto max-w-screen-xl ">
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b-1 border-primary pb-[12px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        <hr className="border-t-2 border-gray-300" />
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" to="/world_news">
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 gap-x-16 md:grid-cols-2 rounded">
        {/* 1) Large Featured Article (index 0) */}
        <div className=" rounded-sm bg-white relative">
          <div className="overflow-hidden relative rounded-sm">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {articles[1]?.urlToImage ? (
              <img
                src={articles[1].urlToImage}
                alt={articles[1].title || "news thumbnail"}
                className="h-[490px] rounded-sm w-full object-cover transition ease-in-out duration-300 transform hover:scale-105 filter brightness-75"
              />
            ) : (
              <div className="h-[490px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
            )}
          </div>

          <div className="absolute bottom-[40px] left-[26px] p-[20px]">
            <h3 className="mb-2 text-[22px] font-bold text-light underline">
              {articles[1]?.title ? (
                articles[1]?.title
              ) : (
                <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
              )}
            </h3>
            <p className="text-light">
              {articles[1]?.publishedAt ? (
                format(new Date(articles[1].publishedAt), "MMM d, yyyy")
              ) : (
                <span className="block h-2 w-1/2 rounded-sm bg-gray-400 animate-pulse"></span>
              )}
            </p>
          </div>
        </div>

        {/* 2 & 3) Two Stacked Articles on the Right */}
        <div className="">
          {[2, 3].map((i) => {
            return (
              <div
                className="grid grid-cols-2 md:grid-cols-2 mb-[30px] bg-white rounded-sm"
                key={i}
              >
                <div className="flex items-center">
                  <div className="grid gap-y-[12px]">
                    {articles[i]?.title ? (
                      <h3 className="mb-1 text-[18px] font-semibold text-gray-800">
                        {articles[i].title &&
                          (articles[i].title.length > 50
                            ? articles[i].title.slice(0, 51) + "..."
                            : articles[i].title)}
                      </h3>
                    ) : (
                      <div className="skeleton">
                        <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                        <div className="block h-[20px] w-[200px] rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
                      </div>
                    )}
                    {articles[i]?.publishedAt ? (
                      <p className="text-xs fw-400">
                        {format(
                          new Date(articles[i].publishedAt),
                          "MMM d, yyyy"
                        )}
                      </p>
                    ) : (
                      <div className="block h-[20px] w-[100px] rounded-sm bg-gray-200 animate-pulse"></div>
                    )}
                  </div>
                </div>
                {articles[i]?.urlToImage ? (
                  <div className="image-container overflow-hidden relative rounded-sm">
                    <img
                      src={articles[i].urlToImage}
                      alt={articles[i].title || "news thumbnail"}
                      className="h-[230px] w-full rounded-sm object-cover transform-transition ease-in-out duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row (Articles #4, #5, #6) */}
      <div className="mt-[14px] gap-x-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        {[4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-sm bg-white">
            {articles[i]?.urlToImage ? (
              <div className="image-container overflow-hidden relative rounded-sm">
                <img
                  src={articles[i].urlToImage}
                  alt={articles[i].title || "news thumbnail"}
                  className="h-[230px] w-full rounded-sm object-cover transform-transition ease-in-out duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div className="block h-[230px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
            )}
            <div className="mt-[8px]">
              {articles[i]?.title ? (
                <h3 className="mb-1 text-[18px] font-semibold text-gray-800">
                  {articles[i]?.title &&
                    (articles[i].title.length > 80
                      ? articles[i].title.slice(0, 80) + "..."
                      : articles[i].title)}
                </h3>
              ) : (
                <div className="block h-[20px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
              )}

              {articles[i]?.publishedAt ? (
                <p className="text-xs fw-400 mt-[8px]">
                  {format(new Date(articles[i].publishedAt), "MMM d, yyyy")}
                </p>
              ) : (
                <div className="block h-[12px] w-full rounded-sm bg-gray-200 animate-pulse mt-[6px]"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
