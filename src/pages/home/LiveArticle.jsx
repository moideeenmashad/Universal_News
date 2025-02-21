import axios from "axios";
import React, { useState, useEffect } from "react";
import { VscCircleFilled } from "react-icons/vsc";

const LiveArticle = () => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
  const API_URL = `https://gnews.io/api/v4/search?q=example&apikey=${API_KEY}`;

  const getLiveNews = () => {
    axios
      .get(API_URL)
      .then((response) => {
        const data = response.data;
        setLoading(false);
        console.log(data.articles.length);
        // setLatestNews(data.articles[0]);
        if (data.articles && data.articles.length > 0) {
          setLatestNews(data.articles[0]);
          console.log("Fetched News:", data);
        } else {
          setError("No latest news available.");
        }
      })
      .catch((err) => {
        console.error("Error Fetching API:", err);
        setError("please check your internet connection");
        setLoading(false);
      });
  };

  useEffect(() => {
    getLiveNews();
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
            <VscCircleFilled style={{ color: "red", marginRight: "5px" }} />
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
