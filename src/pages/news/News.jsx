import React, { useEffect, useState, useRef, useCallback } from "react";
import NewsList from "@/components/layouts/NewsLayout/NewsList";
import axios from "axios";

const News = ({ category, title }) => {
  const [articles, setArticles] = useState([]);
  const articleRefs = useRef([]); // Store refs for lazy loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // Number of articles initially visible
  const observer = useRef(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&page=1&apiKey=${API_KEY}`;

  // Fetch all news articles on mount
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setArticles(response.data.articles || []);
        console.log(response.data.articles)
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news.");
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]); // Fetch only once when category changes

  // Lazy Load Articles
  useEffect(() => {
    if (observer.current) observer.current.disconnect(); // Disconnect old observer

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 5); // Load more articles when in viewport
        }
      });
    });

    if (articleRefs.current.length > 0) {
      observer.current.observe(
        articleRefs.current[articleRefs.current.length - 1]
      );
    }

    return () => observer.current.disconnect();
  }, [visibleCount, articles]); // Run when more articles are loaded

  return (
    <div>
      <NewsList
        title={title}
        articles={articles.slice(0, visibleCount)} // Show only visible articles
        loading={loading}
        error={error}
        lastArticleRef={(el) => {
          if (el) articleRefs.current.push(el);
        }}
      />
    </div>
  );
};

export default News;
