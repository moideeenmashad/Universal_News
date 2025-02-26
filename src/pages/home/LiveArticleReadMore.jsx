import { useLocation } from "react-router-dom";
import { PiCalendarLight } from "react-icons/pi";
import { format } from "date-fns";

const LiveArticleReadMore = () => {
  const location = useLocation();
  const article = location.state?.article;

  if (!article) {
    return <p className="text-center text-lg text-red-500">Article not found.</p>;
  }

  return (
    <section className="mx-auto max-w-screen-xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <img
            src={article.urlToImage || "https://via.placeholder.com/600"}
            alt={article.title}
            className="w-full h-[300px] object-cover mb-[24px]"
          />
          <div className="publisher border-y-2 border-primary py-2 flex items-center gap-x-[10px] mb-[24px]">
            <img
              className="inline-block size-10 rounded-full object-cover"
              src="https://i.ibb.co/FZpNSmN/istockphoto-2151669184-612x612-removebg-preview.png"
              alt="Author Avatar"
            />
            <div className="article-profile">
              <p className="text-lg uppercase font-bold">{article.author || "Unknown Author"}</p>
              <div className="flex items-center text-sm text-gray-600">
                <PiCalendarLight className="mr-[6px]" />
                <p>{format(new Date(article.publishedAt), "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-3xl font-bold mb-[30px]">{article.title}</h1>
            <hr className="border-b-1 border-primary mb-[24px]" />
            <p className="text-lg">{article.content || "Content not available."}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveArticleReadMore;
