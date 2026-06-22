import { Link } from "react-router-dom";

const glossaryItems = [
  {
    title: "What is xG?",
    category: "Football Basics",
    text:
      "Expected goals, or xG, estimates the quality of a scoring chance based on factors like shot location, angle, body part and type of assist.",
  },
  {
    title: "What is pressing?",
    category: "Tactical Analysis",
    text:
      "Pressing is when a team tries to win the ball back quickly by closing down opponents, blocking passing lanes and forcing mistakes.",
  },
  {
    title: "What is a low block?",
    category: "Tactical Analysis",
    text:
      "A low block is a defensive shape where a team sits deep near its own penalty area, stays compact and reduces space behind the defence.",
  },
  {
    title: "What is goal difference?",
    category: "Tournament Guide",
    text:
      "Goal difference is goals scored minus goals conceded. It is often used to separate teams level on points in a league or group table.",
  },
  {
    title: "How does extra time work?",
    category: "Tournament Guide",
    text:
      "Extra time is usually two 15-minute periods played when a knockout match is level after 90 minutes. If still level, the match may go to penalties.",
  },
  {
    title: "How does VAR work?",
    category: "Football Basics",
    text:
      "VAR stands for Video Assistant Referee. It helps review major decisions such as goals, penalties, red cards and mistaken identity.",
  },
  {
    title: "What is a box-to-box midfielder?",
    category: "Player Roles",
    text:
      "A box-to-box midfielder contributes in both defence and attack, covering large areas of the pitch from one penalty box to the other.",
  },
  {
    title: "What is an inverted winger?",
    category: "Player Roles",
    text:
      "An inverted winger plays on the opposite side of their stronger foot, allowing them to cut inside to shoot, combine or create chances.",
  },
];

function FootballGlossary() {
  const categories = [...new Set(glossaryItems.map((item) => item.category))];

  return (
    <div className="page">
      <h1>📚 Football Glossary</h1>

      <p style={{ color: "#cbd5e1", lineHeight: 1.7, maxWidth: "760px" }}>
        Learn football terms, tactics, tournament rules and player roles in
        simple language. This section helps fans understand the game beyond the
        scoreline.
      </p>

      {categories.map((category) => (
        <section key={category} style={{ marginTop: "28px" }}>
          <h2>{category}</h2>

          <div className="card-grid">
            {glossaryItems
              .filter((item) => item.category === category)
              .map((item) => (
                <article
                  key={item.title}
                  style={{
                    background: "#1e293b",
                    border: "1px solid #263449",
                    borderRadius: "18px",
                    padding: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.24)",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{item.title}</h3>

                  <p
                    style={{
                      color: "#cbd5e1",
                      lineHeight: 1.7,
                      marginBottom: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </article>
              ))}
          </div>
        </section>
      ))}

      <div
        style={{
          marginTop: "30px",
          background: "#0f172a",
          border: "1px solid #263449",
          borderRadius: "18px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Want deeper football analysis?</h2>

        <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
          Visit the insights section for tournament guides, tactical explainers
          and football learning articles.
        </p>

        <Link
          to="/insights"
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Read Football Insights
        </Link>
      </div>
    </div>
  );
}

export default FootballGlossary;