import { Link } from "react-router-dom";

function MatchCard({ match }) {
  return (
    <Link
      to={`/match/${match.fixture.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          borderRadius: "15px",
          padding: "20px",
          marginBottom: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img src={match.teams.home.logo} width="40" alt="Home team" />
            <p>{match.teams.home.name}</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "22px", margin: 0 }}>
              {match.goals.home} - {match.goals.away}
            </p>
            <p style={{ margin: 0, color: "#94a3b8" }}>
              {match.fixture.status.elapsed}'
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <img src={match.teams.away.logo} width="40" alt="Away team" />
            <p>{match.teams.away.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MatchCard;