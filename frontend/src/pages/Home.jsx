import { Link } from "react-router-dom";

function Home() {
  const cardStyle = {
    background: "#1e293b",
    padding: "22px",
    borderRadius: "18px",
    color: "white",
    textDecoration: "none",
    border: "1px solid #263449",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };

  return (
    <div style={{ padding: "24px" }}>
      <section
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          padding: "34px",
          borderRadius: "24px",
          marginBottom: "28px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.35)",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>
          ⚽ Football Live
        </h1>

        <p style={{ color: "#e2e8f0", fontSize: "18px", maxWidth: "720px" }}>
          Follow live scores, World Cup fixtures, squads, standings, stadiums,
          top scorers, match stats, and your favorite teams.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            to="/live"
            style={{
              background: "white",
              color: "#1d4ed8",
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🔴 Live Matches
          </Link>

          <Link
            to="/worldcup"
            style={{
              background: "#0f172a",
              color: "white",
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🌎 World Cup Hub
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "16px" }}>Quick Access</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Link to="/live" style={cardStyle}>
            <h2>🔴 Live</h2>
            <p style={{ color: "#cbd5e1" }}>
              See matches currently being played.
            </p>
          </Link>

          <Link to="/standings" style={cardStyle}>
            <h2>📊 Standings</h2>
            <p style={{ color: "#cbd5e1" }}>
              View league tables and team rankings.
            </p>
          </Link>

          <Link to="/topscorers" style={cardStyle}>
            <h2>⚽ Scorers</h2>
            <p style={{ color: "#cbd5e1" }}>
              Track the leading goal scorers.
            </p>
          </Link>

          <Link to="/favorites" style={cardStyle}>
            <h2>⭐ Favorites</h2>
            <p style={{ color: "#cbd5e1" }}>
              Save and follow your favorite teams.
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: "16px" }}>World Cup Features</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Link to="/worldcup" style={cardStyle}>
            <h2>🌎 World Cup</h2>
            <p style={{ color: "#cbd5e1" }}>
              Fixtures, groups, and tournament overview.
            </p>
          </Link>

          <Link to="/worldcup/bracket" style={cardStyle}>
            <h2>🏆 Bracket</h2>
            <p style={{ color: "#cbd5e1" }}>
              Follow the knockout stage path.
            </p>
          </Link>

          <Link to="/worldcup/squads" style={cardStyle}>
            <h2>👥 Squads</h2>
            <p style={{ color: "#cbd5e1" }}>
              Browse national teams and players.
            </p>
          </Link>

          <Link to="/worldcup/stadiums" style={cardStyle}>
            <h2>🏟️ Stadiums</h2>
            <p style={{ color: "#cbd5e1" }}>
              Explore host stadiums and venues.
            </p>
          </Link>

          <Link to="/worldcup/topscorers" style={cardStyle}>
            <h2>⚽ Top Scorers</h2>
            <p style={{ color: "#cbd5e1" }}>
              See the World Cup goal leaders.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;