import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

const FALLBACK_FIXTURES = [
  {
    fixture: {
      id: 66456904,
      date: "2026-06-11T19:00:00Z",
      status: { long: "Scheduled", short: "NS" },
    },
    teams: {
      home: {
        name: "Mexico",
        logo: "https://media.api-sports.io/football/teams/16.png",
      },
      away: {
        name: "South Africa",
        logo: "https://media.api-sports.io/football/teams/24.png",
      },
    },
    goals: { home: null, away: null },
  },
  {
    fixture: {
      id: 66456940,
      date: "2026-06-13T01:00:00Z",
      status: { long: "Scheduled", short: "NS" },
    },
    teams: {
      home: {
        name: "United States",
        logo: "https://media.api-sports.io/football/teams/2384.png",
      },
      away: {
        name: "Paraguay",
        logo: "https://media.api-sports.io/football/teams/14.png",
      },
    },
    goals: { home: null, away: null },
  },
  {
    fixture: {
      id: 66456928,
      date: "2026-06-13T22:00:00Z",
      status: { long: "Scheduled", short: "NS" },
    },
    teams: {
      home: {
        name: "Brazil",
        logo: "https://media.api-sports.io/football/teams/6.png",
      },
      away: {
        name: "Morocco",
        logo: "https://media.api-sports.io/football/teams/31.png",
      },
    },
    goals: { home: null, away: null },
  },
  {
    fixture: {
      id: 66457018,
      date: "2026-06-17T01:00:00Z",
      status: { long: "Scheduled", short: "NS" },
    },
    teams: {
      home: {
        name: "Argentina",
        logo: "https://media.api-sports.io/football/teams/26.png",
      },
      away: {
        name: "Algeria",
        logo: "https://media.api-sports.io/football/teams/34.png",
      },
    },
    goals: { home: null, away: null },
  },
];

const FALLBACK_STANDINGS = [
  {
    league: {
      id: 1,
      name: "FIFA World Cup",
      standings: [
        [
          {
            rank: 1,
            group: "Group A",
            team: {
              id: 16,
              name: "Mexico",
              logo: "https://media.api-sports.io/football/teams/16.png",
            },
            points: 3,
          },
          {
            rank: 2,
            group: "Group A",
            team: {
              id: 17,
              name: "South Korea",
              logo: "https://media.api-sports.io/football/teams/17.png",
            },
            points: 3,
          },
          {
            rank: 3,
            group: "Group A",
            team: {
              id: 24,
              name: "South Africa",
              logo: "https://media.api-sports.io/football/teams/24.png",
            },
            points: 0,
          },
          {
            rank: 4,
            group: "Group A",
            team: {
              id: 21,
              name: "Czechia",
              logo: "https://media.api-sports.io/football/teams/21.png",
            },
            points: 0,
          },
        ],
        [
          {
            rank: 1,
            group: "Group B",
            team: {
              id: 5529,
              name: "Canada",
              logo: "https://media.api-sports.io/football/teams/5529.png",
            },
            points: 1,
          },
          {
            rank: 2,
            group: "Group B",
            team: {
              id: 1118,
              name: "Bosnia and Herzegovina",
              logo: "https://media.api-sports.io/football/teams/1118.png",
            },
            points: 1,
          },
          {
            rank: 3,
            group: "Group B",
            team: {
              id: 1569,
              name: "Qatar",
              logo: "https://media.api-sports.io/football/teams/1569.png",
            },
            points: 0,
          },
          {
            rank: 4,
            group: "Group B",
            team: {
              id: 15,
              name: "Switzerland",
              logo: "https://media.api-sports.io/football/teams/15.png",
            },
            points: 0,
          },
        ],
      ],
    },
  },
];

function WorldCup() {
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadWorldCup();
  }, []);

  const loadWorldCup = async () => {
    try {
      setLoading(true);
      setMessage("");
      setUsingFallback(false);

      const [fixturesRes, standingsRes] = await Promise.all([
        API.get("/worldcup/fixtures"),
        API.get("/worldcup/standings"),
      ]);

      const fixturesHasError =
        fixturesRes.data.errors &&
        Object.keys(fixturesRes.data.errors).length > 0;

      const standingsHasError =
        standingsRes.data.errors &&
        Object.keys(standingsRes.data.errors).length > 0;

      const liveFixtures = fixturesRes.data.response || [];
      const liveStandings = standingsRes.data.response || [];

      if (
        fixturesHasError ||
        standingsHasError ||
        liveFixtures.length === 0 ||
        liveStandings.length === 0
      ) {
        setFixtures(liveFixtures.length > 0 ? liveFixtures : FALLBACK_FIXTURES);
        setStandings(
          liveStandings.length > 0 ? liveStandings : FALLBACK_STANDINGS
        );
        setUsingFallback(true);
        setMessage("");
        return;
      }

      setFixtures(liveFixtures);
      setStandings(liveStandings);
    } catch (error) {
      console.error("World Cup loading error:", error);
      setFixtures(FALLBACK_FIXTURES);
      setStandings(FALLBACK_STANDINGS);
      setUsingFallback(true);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>🌎 FIFA World Cup Hub</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Fixtures, group standings, squads, stadiums, knockout bracket, team
        stats, and World Cup scorers.
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

      <div className="card-grid" style={{ marginBottom: "32px" }}>
        <Link to="/worldcup/bracket" style={featureCardStyle}>
          <h2>🏆 Bracket</h2>
          <p>View knockout rounds and final path.</p>
        </Link>

        <Link to="/worldcup/stadiums" style={featureCardStyle}>
          <h2>🏟️ Stadiums</h2>
          <p>Explore World Cup host stadiums.</p>
        </Link>

        <Link to="/worldcup/topscorers" style={featureCardStyle}>
          <h2>⚽ Top Scorers</h2>
          <p>See leading World Cup goalscorers.</p>
        </Link>

        <Link to="/worldcup/squads" style={featureCardStyle}>
          <h2>👥 Squads</h2>
          <p>Select a country and view players.</p>
        </Link>

        <Link to="/worldcup/teamstats" style={featureCardStyle}>
          <h2>📊 Team Stats</h2>
          <p>Check country performance and stats.</p>
        </Link>

        <Link to="/live" style={featureCardStyle}>
          <h2>🔴 Live Matches</h2>
          <p>Follow live football scores.</p>
        </Link>
      </div>

      <h2>📅 Fixtures</h2>

      {fixtures.length === 0 ? (
        <EmptyState
          title="No fixtures available"
          text="World Cup fixtures could not be loaded right now."
        />
      ) : (
        <div className="card-grid">
          {fixtures.slice(0, 8).map((match) => (
            <Link
              key={match.fixture.id}
              to={`/match/${match.fixture.id}`}
              style={matchCardStyle}
            >
              <h3 style={{ margin: "0 0 10px 0", lineHeight: 1.3 }}>
                {match.teams.home.name} vs {match.teams.away.name}
              </h3>

              <div style={scoreRowStyle}>
                <div style={teamStyle}>
                  <img
                    src={match.teams.home.logo}
                    alt={match.teams.home.name}
                    style={logoStyle}
                  />
                  <span>{match.teams.home.name}</span>
                </div>

                <strong style={{ fontSize: "24px", whiteSpace: "nowrap" }}>
                  {match.goals.home ?? "-"} : {match.goals.away ?? "-"}
                </strong>

                <div style={teamStyle}>
                  <img
                    src={match.teams.away.logo}
                    alt={match.teams.away.name}
                    style={logoStyle}
                  />
                  <span>{match.teams.away.name}</span>
                </div>
              </div>

              <p style={{ margin: "0", color: "#cbd5e1", fontSize: "14px" }}>
                {new Date(match.fixture.date).toLocaleString()}
              </p>

              <p style={{ margin: "8px 0 0 0", color: "#38bdf8" }}>
                {match.fixture.status.long}
              </p>
            </Link>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "36px" }}>📊 Group Standings</h2>

      {standings.length === 0 ? (
        <EmptyState
          title="No standings available"
          text="World Cup group standings could not be loaded right now."
        />
      ) : (
        standings.map((group) => (
          <div key={group.league.id} style={sectionCardStyle}>
            <h3 style={{ margin: "0 0 16px 0" }}>{group.league.name}</h3>

            {group.league.standings?.map((standingGroup, index) => (
              <div key={index} style={{ marginBottom: "18px" }}>
                <h4 style={{ color: "#38bdf8", marginBottom: "10px" }}>
                  {standingGroup[0]?.group || `Group ${index + 1}`}
                </h4>

                {standingGroup.map((team) => (
                  <Link
                    key={team.team.id}
                    to={`/worldcup/teamstats/${team.team.id}`}
                    style={standingRowStyle}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: 0,
                      }}
                    >
                      <span>{team.rank}.</span>

                      <img
                        src={team.team.logo}
                        alt={team.team.name}
                        style={{
                          width: "22px",
                          height: "22px",
                          objectFit: "contain",
                          background: "white",
                          borderRadius: "50%",
                          padding: "3px",
                          flexShrink: 0,
                        }}
                      />

                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {team.team.name}
                      </span>
                    </span>

                    <span
                      style={{
                        color: "#10b981",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {team.points} pts
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
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

const featureCardStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "16px",
  textDecoration: "none",
  color: "white",
  border: "1px solid #1f2937",
  minHeight: "145px",
};

const matchCardStyle = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  border: "1px solid #263449",
};

const scoreRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  margin: "14px 0",
};

const teamStyle = {
  width: "90px",
  textAlign: "center",
  fontSize: "14px",
  color: "#e2e8f0",
};

const logoStyle = {
  width: "42px",
  height: "42px",
  objectFit: "contain",
  display: "block",
  margin: "0 auto 8px",
  background: "white",
  borderRadius: "50%",
  padding: "5px",
};

const sectionCardStyle = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  border: "1px solid #263449",
};

const standingRowStyle = {
  background: "#0f172a",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  color: "white",
  textDecoration: "none",
};

export default WorldCup;
