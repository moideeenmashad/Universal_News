import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { VscCircleFilled } from "react-icons/vsc";
import { BsArrowRightCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const LiveArticle = ({ articleUrlName }) => {
  const [latestNews, setLatestNews] = useState(null); // Now holding a single article
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_DATA_API_KEY;
  // Update the API URL to the one you provided
  // const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=us&prioritydomain=top`;
  const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&country=us&prioritydomain=top&language=en`;
  // https://newsdata.io/api/1/latest?apikey=pub_725176a2440b0e4a1962c1e2967b4fea5d115&country=us&prioritydomain=top

  const getLiveNews = () => {
    axios
      .get(API_URL)
      .then((response) => {
        const article = response.data.results[1]; // Access the first article (or any specific index you want)
        if (article) {
          setLatestNews(article); // Set the single article
          console.log("Live News:", article);
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
        <div className="article-container mb-[24px]">
          <div className="image-container mb-[24px] overflow-hidden relative rounded-sm">
            <img
              src={latestNews.image_url} // Assuming image_url is the correct property for the image
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
            {latestNews.pubDate
              ? formatDistanceToNow(new Date(latestNews.pubDate), {
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
        </div>
      ) : null}
    </div>
  );
};

export default LiveArticle;
