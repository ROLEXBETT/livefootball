export default function About() {
  return (
    <main className="page">
      <h1>About LivePulse</h1>

      <p>
        LivePulse is a football scores and fixtures platform created for fans
        who want quick access to live matches, upcoming fixtures, standings,
        team information, World Cup content, and football updates.
      </p>

      <p>
        Our goal is to make football information simple, fast, and easy to
        follow on both web and mobile.
      </p>

      <h2>What LivePulse Offers</h2>

      <div className="card-grid">
        <section className="card">
          <h3>Live Scores</h3>
          <p>Follow live football matches and score updates.</p>
        </section>

        <section className="card">
          <h3>Fixtures</h3>
          <p>View upcoming football matches and competitions.</p>
        </section>

        <section className="card">
          <h3>Standings</h3>
          <p>Track league tables and team performance.</p>
        </section>

        <section className="card">
          <h3>World Cup</h3>
          <p>Explore World Cup teams, fixtures, squads, and statistics.</p>
        </section>
      </div>
    </main>
  );
}