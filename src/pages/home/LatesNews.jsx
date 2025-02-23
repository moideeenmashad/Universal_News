import axios from "axios";
import React, { useEffect, useState } from "react";

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

  return (
    <div className="mx-auto max-w-screen-xl py-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        <a
          href="/all-news"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All
        </a>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1) Large Featured Article (index 0) */}
        <div className="md:col-span-2 overflow-hidden rounded-lg bg-white ">
          {articles[1]?.urlToImage && (
            <img
              src={articles[1].urlToImage}
              alt={articles[1].title || "news thumbnail"}
              className="h-64 w-full object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              {articles[1]?.title}
            </h3>
            <p className="text-base text-gray-600">
              {articles[1]?.description
                ? articles[1].description.slice(0, 150) + "..."
                : "No description available."}
            </p>
          </div>
        </div>

        {/* 2 & 3) Two Stacked Articles on the Right */}
        <div className="flex flex-col gap-4">
          {[2, 3].map((i) => {
            return (
              <div key={i} className="overflow-hidden rounded-lg bg-white ">
                {articles[i]?.urlToImage ? (
                  <img
                    src={articles[i].urlToImage}
                    alt={articles[i].title || "news thumbnail"}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <img
                    src="/static/placeholder.jpg"
                    alt="placeholder"
                    className="h-32 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold text-gray-800">
                    {articles[i]?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {articles[i]?.description
                      ? articles[i].description.slice(0, 80) + "..."
                      : "No description available."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row (Articles #4, #5, #6) */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white ">
            {articles[i]?.urlToImage && (
              <img
                src={articles[i].urlToImage}
                alt={articles[i].title || "news thumbnail"}
                className="h-32 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                {articles[i]?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {articles[i]?.description
                  ? articles[i].description.slice(0, 80) + "..."
                  : "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
