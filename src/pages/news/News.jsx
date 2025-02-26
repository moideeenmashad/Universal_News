import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NewsList from "@/components/layouts/NewsLayout/NewsList";
import axios from "axios";

const News = ({ category, title }) => {
  const [articles, setArticles] = useState([]);
  const articleUrlsRef = useRef(new Set()); // Store unique URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const observer = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const API_URL = useMemo(() => {
    return `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&page=${page}&apiKey=${API_KEY}`;
  }, [category, page, API_KEY]);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear data when category changes
  useEffect(() => {
    setArticles([]);
    articleUrlsRef.current.clear();
    setPage(1);
    setHasMore(true);
  }, [category]);

  // Fetch News Articles
  const fetchNews = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL);
      const newArticles = response.data.articles || [];

      // Filter out duplicate articles
      const uniqueArticles = newArticles.filter((article) => 
        !articleUrlsRef.current.has(article.url)
      );

      if (uniqueArticles.length > 0) {
        uniqueArticles.forEach(article => articleUrlsRef.current.add(article.url));
        setArticles((prev) => [...prev, ...uniqueArticles]); // Append new articles
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
  }, [API_URL, loading]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Infinite Scroll: Only for desktop
  const lastArticleRef = useCallback(
    (node) => {
      if (isMobile || loading) return;
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
      setArticles([]);
      articleUrlsRef.current.clear();
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
        title={title}
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

export default News;
