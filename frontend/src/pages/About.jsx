export default function About() {
  return (
    <main className="info-page">
      <section className="info-hero">
        <span className="info-badge">⚽ About</span>
        <h1>About LivePulse</h1>
        <p>
          LivePulse is a football scores and fixtures platform created for fans
          who want quick access to live matches, upcoming fixtures, standings,
          team information, World Cup content, and football updates.
        </p>
      </section>

      <section className="info-card">
        <h2>Our Mission</h2>
        <p>
          Our goal is to make football information simple, fast, and easy to
          follow on both web and mobile. LivePulse helps fans stay connected to
          the game through scores, fixtures, statistics, and tournament updates.
        </p>
      </section>

      <section className="info-card">
        <h2>What LivePulse Offers</h2>

        <div className="info-grid">
          <div className="info-feature">
            <h3>🔴 Live Scores</h3>
            <p>Follow live football matches and score updates.</p>
          </div>

          <div className="info-feature">
            <h3>📅 Fixtures</h3>
            <p>View upcoming football matches and competitions.</p>
          </div>

          <div className="info-feature">
            <h3>📊 Standings</h3>
            <p>Track league tables and team performance.</p>
          </div>

          <div className="info-feature">
            <h3>🌎 World Cup</h3>
            <p>Explore World Cup teams, fixtures, squads, and statistics.</p>
          </div>
          <p style={{ color: "#94a3b8", marginTop: "24px" }}> Version 1.0.0 </p>
        </div>
      </section>
    </main>
  );
}