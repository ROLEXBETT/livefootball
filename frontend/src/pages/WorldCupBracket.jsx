import { useEffect, useState } from "react";
import dayjs from "dayjs";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupBracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBracket();
  }, []);

  const loadBracket = async () => {
    try {
      setLoading(true);
      setUsingFallback(false);
      setMessage("");

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
        setMatches(FALLBACK_KNOCKOUT_MATCHES);
        setUsingFallback(true);
        setMessage(
          "Knockout matches could not be loaded right now. Showing saved World Cup knockout data."
        );
      }
    } catch (error) {
      console.error("World Cup bracket error:", error);
      setMatches(FALLBACK_KNOCKOUT_MATCHES);
      setUsingFallback(true);
      setMessage(
        "Unable to connect to the backend. Showing saved World Cup knockout data."
      );
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

      {message && (
        <div
          style={{
            background: usingFallback ? "#78350f" : "#7f1d1d",
            color: usingFallback ? "#fde68a" : "white",
            padding: "16px",
            borderRadius: "14px",
            marginBottom: "24px",
            maxWidth: "760px",
          }}
        >
          {message}
        </div>
      )}

      {matches.length === 0 ? (
        <EmptyState
          title="No knockout matches found"
          text="Check back later for knockout fixtures."
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
        maxWidth: "640px",
      }}
    >
      <h2 style={{ color: "white", marginTop: 0 }}>{title}</h2>
      <p style={{ marginBottom: 0 }}>{text}</p>
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

const FALLBACK_KNOCKOUT_MATCHES = [
  {
    fixture: {
      id: "fallback-r16-1",
      date: "2022-12-03T15:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Round of 16" },
    teams: {
      home: {
        name: "Netherlands",
        logo: "https://media.api-sports.io/football/teams/1118.png",
      },
      away: {
        name: "USA",
        logo: "https://media.api-sports.io/football/teams/2384.png",
      },
    },
    goals: { home: 3, away: 1 },
  },
  {
    fixture: {
      id: "fallback-r16-2",
      date: "2022-12-03T19:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Round of 16" },
    teams: {
      home: {
        name: "Argentina",
        logo: "https://media.api-sports.io/football/teams/25.png",
      },
      away: {
        name: "Australia",
        logo: "https://media.api-sports.io/football/teams/20.png",
      },
    },
    goals: { home: 2, away: 1 },
  },
  {
    fixture: {
      id: "fallback-r16-3",
      date: "2022-12-04T15:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Round of 16" },
    teams: {
      home: {
        name: "France",
        logo: "https://media.api-sports.io/football/teams/2.png",
      },
      away: {
        name: "Poland",
        logo: "https://media.api-sports.io/football/teams/24.png",
      },
    },
    goals: { home: 3, away: 1 },
  },
  {
    fixture: {
      id: "fallback-r16-4",
      date: "2022-12-04T19:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Round of 16" },
    teams: {
      home: {
        name: "England",
        logo: "https://media.api-sports.io/football/teams/10.png",
      },
      away: {
        name: "Senegal",
        logo: "https://media.api-sports.io/football/teams/13.png",
      },
    },
    goals: { home: 3, away: 0 },
  },
  {
    fixture: {
      id: "fallback-qf-1",
      date: "2022-12-09T15:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Quarter-finals" },
    teams: {
      home: {
        name: "Croatia",
        logo: "https://media.api-sports.io/football/teams/3.png",
      },
      away: {
        name: "Brazil",
        logo: "https://media.api-sports.io/football/teams/6.png",
      },
    },
    goals: { home: 1, away: 1 },
  },
  {
    fixture: {
      id: "fallback-qf-2",
      date: "2022-12-09T19:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Quarter-finals" },
    teams: {
      home: {
        name: "Netherlands",
        logo: "https://media.api-sports.io/football/teams/1118.png",
      },
      away: {
        name: "Argentina",
        logo: "https://media.api-sports.io/football/teams/25.png",
      },
    },
    goals: { home: 2, away: 2 },
  },
  {
    fixture: {
      id: "fallback-sf-1",
      date: "2022-12-13T19:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Semi-finals" },
    teams: {
      home: {
        name: "Argentina",
        logo: "https://media.api-sports.io/football/teams/25.png",
      },
      away: {
        name: "Croatia",
        logo: "https://media.api-sports.io/football/teams/3.png",
      },
    },
    goals: { home: 3, away: 0 },
  },
  {
    fixture: {
      id: "fallback-sf-2",
      date: "2022-12-14T19:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Semi-finals" },
    teams: {
      home: {
        name: "France",
        logo: "https://media.api-sports.io/football/teams/2.png",
      },
      away: {
        name: "Morocco",
        logo: "https://media.api-sports.io/football/teams/31.png",
      },
    },
    goals: { home: 2, away: 0 },
  },
  {
    fixture: {
      id: "fallback-third",
      date: "2022-12-17T15:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Third Place" },
    teams: {
      home: {
        name: "Croatia",
        logo: "https://media.api-sports.io/football/teams/3.png",
      },
      away: {
        name: "Morocco",
        logo: "https://media.api-sports.io/football/teams/31.png",
      },
    },
    goals: { home: 2, away: 1 },
  },
  {
    fixture: {
      id: "fallback-final",
      date: "2022-12-18T15:00:00+00:00",
      status: { long: "Match Finished" },
    },
    league: { round: "Final" },
    teams: {
      home: {
        name: "Argentina",
        logo: "https://media.api-sports.io/football/teams/25.png",
      },
      away: {
        name: "France",
        logo: "https://media.api-sports.io/football/teams/2.png",
      },
    },
    goals: { home: 3, away: 3 },
  },
];

export default WorldCupBracket;