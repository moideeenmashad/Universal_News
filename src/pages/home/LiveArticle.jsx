import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { VscCircleFilled } from "react-icons/vsc";
import { BsArrowRightCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const LiveArticle = ({ articleUrlName }) => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
  

  const getLiveNews = () => {
    axios
      .get(API_URL)
      .then((response) => {
        const articles = response.data.articles || [];
        if (articles.length > 0) {
          setLatestNews(articles[0]);
          console.log("Live News:", articles);
        } else {
          setError("No latest news available.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error Fetching API:", err);
        setError("Please check your internet connection.");
        setLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded) {
          getLiveNews();
          setHasLoaded(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  return (
    <div
      ref={containerRef}
      className="live-article-container mx-auto max-w-screen-xl relative mb-[100px]"
    >
      {loading ? (
        <div className="skeleton">
          <div className="animate-pulse relative">
            <div className="h-[580px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
            <span className="absolute top-[18px] left-[18px] bg-white text-xs font-medium px-[12px] py-[12px] rounded-sm flex items-center animate-pulse">
              <VscCircleFilled className="text-gray-600 mr-[5px] animate-pulse" />
              <p className="h-[12px] rounded bg-gray-200 w-24 animate-pulse"></p>
            </span>
          </div>
          <div className="h-[36px] bg-gray-200 w-2/3 animate-pulse mt-[26px]"></div>
          <div className="h-[36px] bg-gray-200 w-1/3 animate-pulse mt-[26px]"></div>
        </div>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : latestNews ? (
        <>
          <div className="image-container mb-[24px] overflow-hidden relative rounded-sm">
            <img
              src={latestNews.urlToImage}
              alt={latestNews.title}
              className="live-article-image h-[580px] w-full rounded-sm object-cover hover:scale-105 ease-in-out transition-transform duration-300"
            />
            <span className="absolute top-[18px] left-[18px] bg-white text-xs font-medium px-[12px] py-[12px] rounded-sm flex items-center">
              <span className="relative flex items-center justify-center mr-[8px]">
                <span className="w-[6px] h-[6px] bg-red-500 rounded-full blink-dot"></span>
                <span className="absolute w-[16px] h-[16px] border border-red-500 rounded-full wave-animation"></span>
              </span>
              Live Updates
            </span>
          </div>
          <div className="flex justify-end mb-[12px] text-xs text-gray-600">
            {latestNews.publishedAt
              ? formatDistanceToNow(new Date(latestNews.publishedAt), {
                  addSuffix: true,
                })
              : "Date not available"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="col-span-3">
              <h1 className="font-semibold text-[36px] leading-[49px]">
                {latestNews.title}
              </h1>
            </div>
            <div className="flex items-start justify-end">
              <Link
                className="flex items-center text-sm link"
                to={`/world-news/${articleUrlName(latestNews.title)}`}
                state={{ article: latestNews }}
              >
                Read Article
                <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LiveArticle;
