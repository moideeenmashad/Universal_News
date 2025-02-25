import React from "react";
import { format } from "date-fns";

const NewsList = ({
  title,
  articles,
  loading,
  error,
  lastArticleRef,
  hasMore,
}) => {
  // Determine if this is the initial load (no articles yet and still loading)
  const isInitialLoad = articles.length === 0 && loading;

  return (
    <section className="mx-auto max-w-screen-xl">
      <div className="news-list-container mx-auto max-w-screen-xl">
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-primary pb-3 mb-10">
          <h2 className="text-4xl font-medium text-primary uppercase">{title}</h2>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-lg text-red-500 bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* 1️⃣ Initial Placeholders */}
          {isInitialLoad &&
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`init-placeholder-${i}`}
                  className="border border-gray-200 p-4 rounded-md animate-pulse"
                >
                  <div className="h-64 w-full bg-gray-300 rounded-sm"></div>
                  <div className="h-6 bg-gray-300 w-2/3 mt-4"></div>
                  <div className="h-4 bg-gray-300 w-1/3 mt-2"></div>
                </div>
              ))}

          {/* 2️⃣ Display Articles */}
          {!isInitialLoad &&
            articles.map((value, index) => {
              const isLast = index === articles.length - 1;
              return (
                <div
                  key={value.url || index}
                  ref={isLast ? lastArticleRef : null}
                  className="border border-gray-300 p-4 rounded-md"
                >
                  <img
                    src={value.urlToImage || "https://via.placeholder.com/300"}
                    alt={value.title || "News Image"}
                    className="h-64 w-full object-cover rounded-sm"
                  />
                  <p className="text-xl font-semibold mt-4">
                    {value.title || "No Title Available"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {value.publishedAt
                      ? format(new Date(value.publishedAt), "EEEE, MMMM d, yyyy")
                      : "Unknown Date"}
                  </p>
                </div>
              );
            })}
        </div>

        {/* 3️⃣ Bottom Placeholders (for additional data loading) */}
        {articles.length > 0 && loading && hasMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`bottom-placeholder-${i}`}
                  className="border border-gray-200 p-4 rounded-md animate-pulse"
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
