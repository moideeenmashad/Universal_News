import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { VscCircleFilled } from "react-icons/vsc";
import { BsArrowRightCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const LiveArticle = (props) => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}`;

  const getLiveNews = () => {
    axios
      .get(API_URL)
      .then((response) => {
        const data = response.data;
        setLoading(false);
        if (data.articles && data.articles.length > 0) {
          setLatestNews(data.articles[0]);
          console.log("Live News:", data.articles);
        } else {
          setError("No latest news available.");
        }
      })
      .catch((err) => {
        console.error("Error Fetching API:", err);
        setError("Please check your internet connection");
        setLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasLoaded) {
          getLiveNews();
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
    <div
      ref={containerRef}
      className="live-article-container mx-auto max-w-screen-xl relative mb-[100px]"
    >
      {loading ? (
        <div className="skeleton">
          <div className="animate-pulse relative">
            <div className="h-[580px] w-full rounded-sm bg-gray-200 animate-pulse"></div>
            <span className="absolute top-[16px] left-[16px] bg-white text-xs font-medium px-[10px] py-[10px] rounded-sm flex items-center animate-pulse">
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
              className="live-article-image h-[580px] w-full rounded-sm object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <span className="absolute top-[16px] left-[16px] bg-white text-xs font-medium px-[10px] py-[10px] rounded-sm flex items-center">
              <VscCircleFilled className="mr-[5px]" style={{ color: "red" }} />
              Live Updates
            </span>
          </div>
          <div className="flex justify-end mb-[12px]">
            <p className="text-xs">
              {latestNews.publishedAt
                ? format(
                    new Date(latestNews.publishedAt),
                    "MMM d, yyyy  —  mm 'Minute'"
                  )
                : "Date not available"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
            <div className="col-span-3 items-center">
              <h1 className="fw-500 text-[36px] leading-[49px]">
                {latestNews.title}
              </h1>
            </div>
            <div className="flex items-start justify-end">
              <Link
                className="flex items-center text-sm link"
                to={`/world_news/${props.articleUrlName(latestNews.title)}`}
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
