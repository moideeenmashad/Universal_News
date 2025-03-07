import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import { format } from "date-fns";
import { BsDashLg } from "react-icons/bs";

const TechnologyNewsSection = ({ title, articleUrlName }) => {
  const [articles, setArticles] = useState([]);
  const articleRefs = useRef([]); // Store refs for lazy loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // Initially visible articles
  const observer = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // Fetch news articles on mount or when the category changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      let API_URL = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=20&page=1&apiKey=${API_KEY}`;
      try {
        const response = await axios.get(API_URL);
        setArticles(response.data.articles || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news.");
      }
    };

    fetchNews();
  }, [API_KEY]);

  // Lazy Load Articles
  useEffect(() => {
    if (observer.current) observer.current.disconnect(); // Disconnect old observer

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 5); // Load more articles when last one is visible
      }
    });

    if (articleRefs.current.length > 0) {
      observer.current.observe(
        articleRefs.current[articleRefs.current.length - 1]
      );
    }

    return () => observer.current.disconnect();
  }, [visibleCount, articles]);
  return (
    <div className="mx-auto max-w-screen-xl mb-[100px]">
      {/* Section Header */}
      <div className="mb-[30px] flex items-center justify-between border-b border-primary pb-[12px]">
        <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        {/* <hr className="border-t-2 border-gray-300 mx-4" /> */}
        <div className="flex items-start justify-end">
          <Link className="flex items-center text-sm link" to="/technology">
            View All
            <BsArrowRightCircle className="ml-[5px] h-[20px] w-[20px]" />
          </Link>
        </div>
      </div>
      {/* Section Header ends here */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="animate-pulse" key={index}>
              <div className="h-64 w-full bg-gray-300 rounded-sm" />
              <p className="flex items-center text-xs text-gray-400 mt-2 gap-x-2">
                <span className="h-4 w-16 bg-gray-300 rounded" />
                <span className="h-4 w-24 bg-gray-300 rounded" />
              </p>
              <p className="h-6 w-3/4 bg-gray-300 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16">
          {articles.slice(1, 5).map((value, index) => {
            return (
              <div className="" key={index}>
                <div className="image-container overflow-hidden relative rounded-sm">
                  <img
                    src={value.urlToImage || "https://via.placeholder.com/300"}
                    alt={value.title || "News Image"}
                    className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="flex items-center text-xs text-primary mt-[8px] gap-x-[8px]">
                  <span>
                    {value.author && value.author.trim() !== ""
                      ? value.author
                      : "Unknown"}
                  </span>
                  <BsDashLg />
                  <span>
                    {value.publishedAt
                      ? format(new Date(value.publishedAt), "MMMM d, yyyy")
                      : "Unknown Date"}
                  </span>
                </p>
                <p className="text-[18px] mt-4 fw-500">
                  {value.title && value.title.length > 50
                    ? value.title.slice(0, 50) + "..."
                    : value.title}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechnologyNewsSection;
