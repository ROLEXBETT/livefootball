import { Link, Navigate, useParams } from "react-router-dom";
import { insights } from "../data/insights";

export default function ArticleDetail() {
  const { slug } = useParams();

  const article = insights.find((item) => item.slug === slug);

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  const paragraphs = article.content
    .trim()
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="page article-page">
      <Link to="/insights" className="primary-link">
        ← Back to Insights
      </Link>

      <article className="article-card">
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p className="article-summary">{article.summary}</p>

        <div className="article-content">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}