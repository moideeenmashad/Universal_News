import React, { useEffect, useState, useRef } from "react";
import NewsList from "@/components/layouts/NewsLayout/NewsList";
import axios from "axios";

const News = ({ category, title }) => {
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

      let API_URL = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&page=1&apiKey=${API_KEY}`;
      if (category === "world-news") {
        API_URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&page=1&apiKey=${API_KEY}`;
      }

      try {
        const response = await axios.get(API_URL);
        setArticles(response.data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news.");
      }
      setLoading(false);
    };

    fetchNews();
  }, [category, API_KEY]);

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
    <div>
      <NewsList
        title={title}
        articles={articles.slice(0, visibleCount)} // Show only visible articles
        loading={loading}
        error={error}
        category={category}
        lastArticleRef={(el) => {
          if (el) {
            articleRefs.current = [el]; // Track only the last article
          }
        }}
      />
    </div>
  );
};

export default News;
