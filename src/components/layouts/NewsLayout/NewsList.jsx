import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BsDashLg } from "react-icons/bs";

const NewsList = ({
  title,
  articles,
  loading,
  error,
  lastArticleRef,
  hasMore,
  category,
}) => {
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  };
  const navigate = useNavigate();
  const isInitialLoad = articles.length === 0 && loading;

  return (
    <section className="mx-auto max-w-screen-xl mb-[100px]">
      <div className="news-list-container mx-auto max-w-screen-xl">
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-primary pb-3 mb-10">
          <h2 className="text-4xl font-medium text-primary uppercase">
            {title}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-lg text-red-500 bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* Initial Placeholders */}
          {isInitialLoad &&
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`init-placeholder-${i}`}
                  className="  rounded-md animate-pulse"
                >
                  <div className="h-64 w-full bg-gray-300 rounded-sm"></div>
                  <div className="h-6 bg-gray-300 w-2/3 mt-4"></div>
                  <div className="h-4 bg-gray-300 w-1/3 mt-2"></div>
                </div>
              ))}

          {/* Display Articles */}
          {!isInitialLoad &&
            articles.map((value, index) => {
              const isLast = index === articles.length - 1;
              return (
                <div
                  key={value.url || index}
                  ref={isLast ? lastArticleRef : null}
                  className=" rounded-md cursor-pointer"
                  onClick={() =>
                    navigate(`/${category}/${slugify(value.title)}`, {
                      state: { article: value },
                    })
                  }
                >
                  <div className="image-container overflow-hidden relative rounded-sm">
                    <img
                      src={
                        value.urlToImage || "https://via.placeholder.com/300"
                      }
                      alt={value.title || "News Image"}
                      className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xl font-semibold mt-4">
                    {value.title && value.title.length > 60
                      ? value.title.slice(0, 60) + "..."
                      : value.title}
                  </p>
                  <p className="flex items-center text-xs text-primary mt-2 gap-x-[8px]">
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
                </div>
              );
            })}
        </div>

        {/* Bottom Placeholders (for additional data loading) */}
        {articles.length > 0 && loading && hasMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`bottom-placeholder-${i}`}
                  className=" rounded-md animate-pulse"
                >
                  <div className="h-64 w-full bg-gray-300 rounded-sm"></div>
                  <div className="h-6 bg-gray-300 w-2/3 mt-4"></div>
                  <div className="h-4 bg-gray-300 w-1/3 mt-2"></div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
