import { useLocation, useParams } from "react-router-dom";

const LiveArticleReadMore = () => {
  const { id } = useParams(); // Get article ID from URL
  const location = useLocation(); // Get passed data
  const article = location.state?.article;

  if (!article) {
    return (
      <p className="text-center text-lg text-red-500">Article not found.</p>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-lg p-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <img
        src={article.urlToImage}
        alt={article.title}
        className="w-full h-auto mb-4"
      />
      <p className="text-lg">{article.description}</p>
    </div>
  );
};

export default LiveArticleReadMore;
