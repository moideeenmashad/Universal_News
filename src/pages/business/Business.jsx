import React, { useEffect, useState, useRef, useCallback } from "react";
import NewsList from "@/components/layouts/NewsLayout/NewsList";
import axios from "axios";

const Business = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const observer = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  // Use pageSize=10 for infinite scroll and pagination
  const API_URL = `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&page=${page}&apiKey=${API_KEY}`;

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch News Articles
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      const newArticles = response.data.articles;
      if (newArticles.length > 0) {
        // On mobile, replace articles; on desktop, append articles.
        setArticles((prev) =>
          isMobile ? newArticles : [...prev, ...newArticles]
        );
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news.");
      setHasMore(false);
    }
    setLoading(false);
  }, [API_URL, isMobile]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews, page]);

  // Infinite Scroll: Only for desktop (isMobile === false)
  const lastArticleRef = useCallback(
    (node) => {
      if (isMobile || loading) return; // Don't attach observer on mobile
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isMobile]
  );

  // Pagination handlers for mobile
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <NewsList
        title="Business News"
        articles={articles}
        loading={loading}
        error={error}
        lastArticleRef={lastArticleRef}
        hasMore={hasMore}
      />

      {/* Pagination Controls for Mobile */}
      {isMobile && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={!hasMore || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Business;
