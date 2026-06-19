import { useEffect, useState } from "react";
import dayjs from "dayjs";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupBracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBracket();
  }, []);

  const loadBracket = async () => {
    try {
      setLoading(true);

      const res = await API.get("/worldcup/knockout");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const fixtures = res.data.response || [];

      const knockout = fixtures.filter((match) => {
        const round = match.league?.round || "";

        return (
          round.includes("Round of 16") ||
          round.includes("Quarter-finals") ||
          round.includes("Semi-finals") ||
          round.includes("Third Place") ||
          round.includes("Final")
        );
      });

      if (!hasApiError && knockout.length > 0) {
        setMatches(knockout);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("World Cup bracket error:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches = matches.reduce((groups, match) => {
    const round = match.league?.round || "Knockout";

    if (!groups[round]) {
      groups[round] = [];
    }

    groups[round].push(match);

    return groups;
  }, {});

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>🏆 World Cup Knockout Stage</h1>

      <p style={{ color: "#cbd5e1", marginTop: "8px", marginBottom: "20px" }}>
        Follow the knockout path from the Round of 16 to the Final.
      </p>

      {matches.length === 0 ? (
        <EmptyState
          title="World Cup 2026 knockout stage not started yet"
          text="Knockout matches will appear here automatically when the Round of 16, quarter-finals, semi-finals, third-place match, and final fixtures are available."
        />
      ) : (
        Object.entries(groupedMatches).map(([round, roundMatches]) => (
          <section key={round} style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "16px" }}>{round}</h2>

            <div className="card-grid">
              {roundMatches.map((match) => (
                <div key={match.fixture.id} style={matchCardStyle}>
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      lineHeight: 1.3,
                    }}
                  >
                    {match.teams?.home?.name || "TBD"} vs{" "}
                    {match.teams?.away?.name || "TBD"}
                  </h3>

                  <div style={scoreRowStyle}>
                    <TeamBlock team={match.teams?.home} />

                    <strong style={scoreStyle}>
                      {match.goals?.home ?? "—"} : {match.goals?.away ?? "—"}
                    </strong>

                    <TeamBlock team={match.teams?.away} />
                  </div>

                  <div
                    style={{
                      background: "#0f172a",
                      padding: "12px",
                      borderRadius: "12px",
                      marginTop: "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#cbd5e1",
                        fontSize: "14px",
                      }}
                    >
                      {match.fixture?.date
                        ? new Date(match.fixture.date).toLocaleString()
                        : "Date unavailable"}
                    </p>

                    <p
                      style={{
                        margin: "6px 0 0 0",
                        color: "#38bdf8",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {getMatchStatus(match)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function TeamBlock({ team }) {
  return (
    <div style={teamBlockStyle}>
      {team?.logo ? (
        <img src={team.logo} alt={team.name} style={logoStyle} />
      ) : (
        <div style={emptyLogoStyle}>?</div>
      )}

      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#e2e8f0",
          lineHeight: 1.25,
        }}
      >
        {team?.name || "TBD"}
      </p>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #263449",
        color: "#cbd5e1",
        maxWidth: "760px",
      }}
    >
      <h2 style={{ color: "white", marginTop: 0 }}>{title}</h2>
      <p style={{ marginBottom: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function getMatchStatus(match) {
  const status = match.fixture?.status?.long;

  if (status) {
    return status;
  }

  if (!match.fixture?.date) {
    return "Status unavailable";
  }

  const matchDate = dayjs(match.fixture.date);

  if (matchDate.isBefore(dayjs())) {
    return "Match finished";
  }

  const hoursRemaining = matchDate.diff(dayjs(), "hour");

  if (hoursRemaining <= 0) {
    return "Starting soon";
  }

  return `⏳ ${hoursRemaining} hours remaining`;
}

const matchCardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #263449",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  color: "white",
};

const scoreRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const scoreStyle = {
  fontSize: "26px",
  minWidth: "76px",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const teamBlockStyle = {
  textAlign: "center",
  width: "95px",
  minWidth: "80px",
};

const logoStyle = {
  width: "48px",
  height: "48px",
  objectFit: "contain",
  marginBottom: "8px",
  background: "white",
  borderRadius: "50%",
  padding: "5px",
};

const emptyLogoStyle = {
  width: "48px",
  height: "48px",
  margin: "0 auto 8px",
  background: "#0f172a",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  fontWeight: "bold",
};

export default WorldCupBracket;