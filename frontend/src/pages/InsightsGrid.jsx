import { Link } from "react-router-dom";
import { insights } from "../data/insights";

export default function InsightsGrid() {
  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">LivePulse Insights</p>
        <h1>Football Insights & Match Previews</h1>
        <p>
          Read tactical previews, tournament guides, and football analysis for
          fans who want more than just the score.
        </p>
      </section>

      <section className="card-grid">
        {insights.map((article) => (
          <article key={article.slug} className="card">
            <p className="eyebrow">{article.category}</p>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>

            <Link className="primary-link" to={`/insights/${article.slug}`}>
              Read Analysis →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}