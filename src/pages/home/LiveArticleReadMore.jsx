import { useLocation, useParams } from "react-router-dom";
import { PiCalendarLight } from "react-icons/pi";
import { format } from "date-fns";
const LiveArticleReadMore = () => {
  const { id } = useParams(); // Get article ID from URL
  const location = useLocation(); // Get passed data
  const article = location.state?.article;

  if (!article) {
    return (
      <p className="text-center text-lg text-red-500">Article not found.</p>
    );
  }

  const formattedDate = format(
    new Date(article.publishedAt),
    "EEEE, MMMM d, yyyy"
  );

  return (
    <section className="mx-auto max-w-screen-xl">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-col-1 lg:grid-cols-4 mb-[24px]">
        <div className="col-span-3">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-[300px] object-cover object-center mb-[24px]"
          />
          <div className="publisher border-y-2 border-primary py-2 flex item-center gap-x-[10px] mb-[24px] flex items-center">
            <img
              className="inline-block size-10 rounded-full object-center object-contain"
              src="https://i.ibb.co/FZpNSmN/istockphoto-2151669184-612x612-removebg-preview.png"
              alt=""
            />
            <div className="article-profile">
              <p className="text-lg uppercase fw-800">{article.author}</p>
              <div className="date-container flex items-center">
                <PiCalendarLight className="mr-[6px]" />
                <p className="text-[16px]">{formattedDate}</p>
              </div>
            </div>
          </div>
          <div className="article-content-container">
            <h1 className="text-3xl font-bold mb-[30px]">{article.title}</h1>
            <hr className="border-b-1 border-primary mb-[24px]" />
            <div className="article-content-container gap-y-6">
              <p className="text-lg">{article.content}</p>
            </div>
          </div>
        </div>
        {/* <div className="ads-container"></div> */}
      </div>
    </section>
  );
};

export default LiveArticleReadMore;
