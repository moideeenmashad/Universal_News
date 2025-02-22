import axios from "axios";
import { React, useState, useEffect } from "react";
import { VscCircleFilled } from "react-icons/vsc";
import { BsArrowRightCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
const LiveArticle = () => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  // const API_URL = `https://gnews.io/api/v4/search?q=example&apikey=${API_KEY}`;
  const API_URL = `https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}`;

  const getLiveNews = () => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((response) => {
        const data = response.data;
        setLoading(false);

        if (data.articles && data.articles.length > 0) {
          setLatestNews(data.articles[0]);
          console.log("Fetched News:", data);
          console.log(data.publishedAt);
          console.log(typeof data.publishedAt);
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
    getLiveNews();
  }, []);

  return (
    <div className="live-article-container mx-auto max-w-screen-xl relative">
      {loading ? (
        <div className="animate-pulse relative">
          <div className="h-[580px] w-full rounded-sm bg-gray-200"></div>
          <span className="absolute top-[16px] left-[16px] bg-white text-xs font-medium px-[10px] py-[10px] rounded-sm flex items-center">
            <VscCircleFilled className="text-gray-600 mr-[5px]" />
            <p className="h-[12px] rounded bg-gray-200 w-24"></p>
          </span>
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
          <div className="flex justify-end">
            <p className="text-xs">{latestNews.publishedAt}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
            <div className="col-span-3 items-center">
              <h1 className="fw-500 text-[36px] leading-[49px]">
                {latestNews.title}
              </h1>
            </div>
            <div className="flex justify-end">
              <Link
                className="flex items-center text-sm"
                to={`/article/${latestNews.title}`}
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
