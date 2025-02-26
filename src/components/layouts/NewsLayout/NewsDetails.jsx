import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiCalendarLight } from "react-icons/pi";
import { format } from "date-fns";
import axios from "axios";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/--+/g, "-"); // Replace multiple dashes

const NewsDetails = () => {
  const { category, title } = useParams(); // Get URL params
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(!article);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&page=1&apiKey=${API_KEY}`;

  useEffect(() => {
    if (article) return; // If article exists, don't fetch

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        console.log("Fetched articles:", response.data.articles);

        const matchedArticle = response.data.articles.find((a) => {
          const apiTitleSlug = slugify(a.title);
          return apiTitleSlug === title;
        });

        if (matchedArticle) {
          setArticle(matchedArticle);
        } else {
          setError("Article not found.");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article.");
      }
      setLoading(false);
    };

    fetchArticle();
  }, [category, title, article]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  const formattedDate = format(
    new Date(article.publishedAt),
    "EEEE, MMMM d, yyyy"
  );

  return (
    <section className="mx-auto max-w-screen-xl">
      
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <img
            src={article.urlToImage || "https://via.placeholder.com/300"}
            alt={article.title}
            className="w-full h-[300px] object-cover object-center mb-[24px]"
          />
          <div className="publisher border-y-2 border-primary py-2 flex items-center gap-x-[10px] mb-[24px]">
            <img
              className="inline-block size-10 rounded-full object-center object-contain"
              src="https://i.ibb.co/FZpNSmN/istockphoto-2151669184-612x612-removebg-preview.png"
              alt="Author"
            />
            <div className="article-profile">
              <p className="text-lg uppercase fw-800">
                {article.author || "Unknown"}
              </p>
              <div className="date-container flex items-center">
                <PiCalendarLight className="mr-[6px]" />
                <p className="text-[16px]">{formattedDate}</p>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-3xl font-bold mb-[30px]">{article.title}</h1>
            <hr className="border-b-1 border-primary mb-[24px]" />
            <p className="text-lg">{article.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsDetails;
