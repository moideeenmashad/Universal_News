import React, { useState, useEffect } from "react";
import { VscCircleFilled } from "react-icons/vsc";

const LiveArticle = () => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
//   const API_URL = `http://localhost:5000`;
//   const API_URL = `https://gnews.io/api/v4/search?q=example&apikey=833d8462199090f03f9797f8435cfd5b`;
  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
  const API_URL = `https://gnews.io/api/v4/search?q=example&apikey=${API_KEY}`;
  console.log("API Key:", import.meta.env.VITE_GNEWS_API_KEY);
  console.log(import.meta.env); // For Vite

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setLatestNews(data.articles[0]); // Get the latest news article
          console.log(data);
        } else {
          setError("No latest news available.");
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className="live-article-container mx-auto max-w-screen-xl relative">
      {loading ? (
        <p className="text-center text-lg font-medium">
          Loading latest news...
        </p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : latestNews ? (
        <>
          <img
            src={latestNews.image}
            alt={latestNews.title}
            className="live-article-image h-[580px] w-full rounded-sm object-cover object-center"
          />
          <span className="absolute top-[16px] left-[16px] bg-white text-xs font-medium px-[10px] py-[5px] rounded-sm flex items-center">
            <VscCircleFilled style={{ color: "red", marginRight: "5px" }} />{" "}
            Live Updates
          </span>
          <div className="bg-white p-4 rounded-sm">
            <h2 className="text-lg font-semibold">{latestNews.title}</h2>
            <p className="text-sm">{latestNews.description}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LiveArticle;
