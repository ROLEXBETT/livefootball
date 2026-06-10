import { useEffect, useState } from "react";
import dayjs from "dayjs";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupBracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadBracket();
  }, []);

  const loadBracket = async () => {
    try {
      setLoading(true);
      setUsingFallback(false);

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
      }
    } catch (error) {
      console.log("World Cup bracket error:", error);
      setMatches(FALLBACK_KNOCKOUT_MATCHES);
      setUsingFallback(true);
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
    <div style={{ padding: "24px" }}>
      <h1>🏆 World Cup Knockout Stage</h1>

      <p style={{ color: "#cbd5e1", marginTop: "8px", marginBottom: "20px" }}>
        Follow the knockout path from the Round of 16 to the Final.
      </p>

      {usingFallback && (
        <div
          style={{
            background: "#78350f",
            color: "#fde68a",
            padding: "14px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            maxWidth: "760px",
          }}
        >
          API limit reached or knockout matches could not be loaded. Showing
          saved World Cup knockout data for now.
        </div>
      )}

      {matches.length === 0 ? (
        <div
          style={{
            background: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            color: "#cbd5e1",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>
            No knockout matches found
          </h2>
          <p>Check back later for knockout fixtures.</p>
        </div>
      ) : (
        Object.entries(groupedMatches).map(([round, roundMatches]) => (
          <section key={round} style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "16px" }}>{round}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {roundMatches.map((match) => (
                <div
                  key={match.fixture.id}
                  style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "16px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  }}
                >
                  <h3 style={{ margin: "0 0 14px 0" }}>
                    {match.teams?.home?.name || "TBD"} vs{" "}
                    {match.teams?.away?.name || "TBD"}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <TeamBlock team={match.teams?.home} />

                    <strong style={{ fontSize: "28px", minWidth: "70px" }}>
                      {match.goals?.home ?? "—"} : {match.goals?.away ?? "—"}
                    </strong>

                    <TeamBlock team={match.teams?.away} />
                  </div>

                  <p
                    style={{
                      margin: "16px 0 0 0",
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
    <div style={{ textAlign: "center", width: "95px" }}>
      {team?.logo && (
        <img
          src={team.logo}
          alt={team.name}
          style={{
            width: "44px",
            height: "44px",
            objectFit: "contain",
            marginBottom: "8px",
          }}
        />
      )}

      <p style={{ margin: 0, fontSize: "14px" }}>{team?.name || "TBD"}</p>
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

  return `⏳ ${matchDate.diff(dayjs(), "hour")} hours remaining`;
}

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
        logo: "https://media.api-sports.io/football/teams/20.png",
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
        logo: "https://media.api-sports.io/football/teams/21.png",
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
        logo: "https://media.api-sports.io/football/teams/20.png",
      },
      away: {
        name: "Morocco",
        logo: "https://media.api-sports.io/football/teams/767.png",
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
        logo: "https://media.api-sports.io/football/teams/767.png",
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
        logo: "https://media.api-sports.io/football/teams/20.png",
      },
    },
    goals: { home: 3, away: 3 },
  },
];

export default WorldCupBracket;