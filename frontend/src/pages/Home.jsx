import { Link } from "react-router-dom";

function Home() {
  const cardStyle = {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "18px",
    color: "white",
    textDecoration: "none",
    border: "1px solid #263449",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    minHeight: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const cardTextStyle = {
    color: "#cbd5e1",
    marginBottom: 0,
  };

  const sectionTitleStyle = {
    marginBottom: "16px",
  };

  const buttonRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "24px",
  };

  const primaryButtonStyle = {
    background: "white",
    color: "#1d4ed8",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const secondaryButtonStyle = {
    background: "#0f172a",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="page">
      <section
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          padding: "clamp(22px, 6vw, 34px)",
          borderRadius: "24px",
          marginBottom: "28px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.35)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(30px, 9vw, 42px)",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          ⚽ LivePulse
        </h1>

        <p
          style={{
            color: "#e2e8f0",
            fontSize: "clamp(15px, 4vw, 18px)",
            lineHeight: 1.55,
            maxWidth: "720px",
            marginBottom: 0,
          }}
        >
          Follow live scores, World Cup fixtures, squads, standings, stadiums,
          top scorers, match stats, and your favorite teams.
        </p>

        <div style={buttonRowStyle}>
          <Link to="/live" style={primaryButtonStyle}>
            🔴 Live Matches
          </Link>

          <Link to="/worldcup" style={secondaryButtonStyle}>
            🌎 World Cup Hub
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={sectionTitleStyle}>Quick Access</h2>

        <div className="card-grid">
          <Link to="/live" style={cardStyle}>
            <div>
              <h2>🔴 Live</h2>
              <p style={cardTextStyle}>See matches currently being played.</p>
            </div>
          </Link>

          <Link to="/standings" style={cardStyle}>
            <div>
              <h2>📊 Standings</h2>
              <p style={cardTextStyle}>
                View league tables and team rankings.
              </p>
            </div>
          </Link>

          <Link to="/topscorers" style={cardStyle}>
            <div>
              <h2>⚽ Scorers</h2>
              <p style={cardTextStyle}>Track the leading goal scorers.</p>
            </div>
          </Link>

          <Link to="/favorites" style={cardStyle}>
            <div>
              <h2>⭐ Favorites</h2>
              <p style={cardTextStyle}>
                Save and follow your favorite teams.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>World Cup Features</h2>

        <div className="card-grid">
          <Link to="/worldcup" style={cardStyle}>
            <div>
              <h2>🌎 World Cup</h2>
              <p style={cardTextStyle}>
                Fixtures, groups, and tournament overview.
              </p>
            </div>
          </Link>

          <Link to="/worldcup/bracket" style={cardStyle}>
            <div>
              <h2>🏆 Bracket</h2>
              <p style={cardTextStyle}>Follow the knockout stage path.</p>
            </div>
          </Link>

          <Link to="/worldcup/squads" style={cardStyle}>
            <div>
              <h2>👥 Squads</h2>
              <p style={cardTextStyle}>
                Browse national teams and players.
              </p>
            </div>
          </Link>

          <Link to="/worldcup/stadiums" style={cardStyle}>
            <div>
              <h2>🏟️ Stadiums</h2>
              <p style={cardTextStyle}>Explore host stadiums and venues.</p>
            </div>
          </Link>

          <Link to="/worldcup/topscorers" style={cardStyle}>
            <div>
              <h2>⚽ Top Scorers</h2>
              <p style={cardTextStyle}>See the World Cup goal leaders.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;