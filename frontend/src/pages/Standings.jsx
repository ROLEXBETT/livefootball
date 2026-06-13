import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const FALLBACK_STANDINGS = {
  39: [
    {
      rank: 1,
      team: {
        id: 50,
        name: "Manchester City",
        logo: "https://media.api-sports.io/football/teams/50.png",
      },
      points: 86,
      goalsDiff: 48,
      all: { played: 38, win: 26, draw: 8, lose: 4 },
    },
    {
      rank: 2,
      team: {
        id: 40,
        name: "Liverpool",
        logo: "https://media.api-sports.io/football/teams/40.png",
      },
      points: 84,
      goalsDiff: 45,
      all: { played: 38, win: 25, draw: 9, lose: 4 },
    },
    {
      rank: 3,
      team: {
        id: 42,
        name: "Arsenal",
        logo: "https://media.api-sports.io/football/teams/42.png",
      },
      points: 82,
      goalsDiff: 43,
      all: { played: 38, win: 25, draw: 7, lose: 6 },
    },
    {
      rank: 4,
      team: {
        id: 33,
        name: "Manchester United",
        logo: "https://media.api-sports.io/football/teams/33.png",
      },
      points: 70,
      goalsDiff: 20,
      all: { played: 38, win: 21, draw: 7, lose: 10 },
    },
  ],
  140: [
    {
      rank: 1,
      team: {
        id: 529,
        name: "Barcelona",
        logo: "https://media.api-sports.io/football/teams/529.png",
      },
      points: 88,
      goalsDiff: 50,
      all: { played: 38, win: 27, draw: 7, lose: 4 },
    },
    {
      rank: 2,
      team: {
        id: 541,
        name: "Real Madrid",
        logo: "https://media.api-sports.io/football/teams/541.png",
      },
      points: 86,
      goalsDiff: 46,
      all: { played: 38, win: 26, draw: 8, lose: 4 },
    },
    {
      rank: 3,
      team: {
        id: 530,
        name: "Atletico Madrid",
        logo: "https://media.api-sports.io/football/teams/530.png",
      },
      points: 76,
      goalsDiff: 30,
      all: { played: 38, win: 23, draw: 7, lose: 8 },
    },
  ],
  78: [
    {
      rank: 1,
      team: {
        id: 157,
        name: "Bayern Munich",
        logo: "https://media.api-sports.io/football/teams/157.png",
      },
      points: 78,
      goalsDiff: 55,
      all: { played: 34, win: 24, draw: 6, lose: 4 },
    },
    {
      rank: 2,
      team: {
        id: 165,
        name: "Borussia Dortmund",
        logo: "https://media.api-sports.io/football/teams/165.png",
      },
      points: 72,
      goalsDiff: 35,
      all: { played: 34, win: 22, draw: 6, lose: 6 },
    },
    {
      rank: 3,
      team: {
        id: 173,
        name: "RB Leipzig",
        logo: "https://media.api-sports.io/football/teams/173.png",
      },
      points: 68,
      goalsDiff: 30,
      all: { played: 34, win: 20, draw: 8, lose: 6 },
    },
  ],
  135: [
    {
      rank: 1,
      team: {
        id: 496,
        name: "Juventus",
        logo: "https://media.api-sports.io/football/teams/496.png",
      },
      points: 82,
      goalsDiff: 38,
      all: { played: 38, win: 25, draw: 7, lose: 6 },
    },
    {
      rank: 2,
      team: {
        id: 489,
        name: "AC Milan",
        logo: "https://media.api-sports.io/football/teams/489.png",
      },
      points: 79,
      goalsDiff: 34,
      all: { played: 38, win: 24, draw: 7, lose: 7 },
    },
    {
      rank: 3,
      team: {
        id: 505,
        name: "Inter",
        logo: "https://media.api-sports.io/football/teams/505.png",
      },
      points: 77,
      goalsDiff: 32,
      all: { played: 38, win: 23, draw: 8, lose: 7 },
    },
  ],
  61: [
    {
      rank: 1,
      team: {
        id: 85,
        name: "Paris Saint Germain",
        logo: "https://media.api-sports.io/football/teams/85.png",
      },
      points: 84,
      goalsDiff: 50,
      all: { played: 34, win: 26, draw: 6, lose: 2 },
    },
    {
      rank: 2,
      team: {
        id: 81,
        name: "Marseille",
        logo: "https://media.api-sports.io/football/teams/81.png",
      },
      points: 72,
      goalsDiff: 28,
      all: { played: 34, win: 21, draw: 9, lose: 4 },
    },
    {
      rank: 3,
      team: {
        id: 80,
        name: "Lyon",
        logo: "https://media.api-sports.io/football/teams/80.png",
      },
      points: 65,
      goalsDiff: 22,
      all: { played: 34, win: 19, draw: 8, lose: 7 },
    },
  ],
};

function Standings() {
  const leagues = [
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 78, name: "Bundesliga" },
    { id: 135, name: "Serie A" },
    { id: 61, name: "Ligue 1" },
  ];

  const [leagueId, setLeagueId] = useState(39);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const selectedLeague =
    leagues.find((league) => league.id === leagueId)?.name || "Standings";

  useEffect(() => {
    loadTable();
  }, [leagueId]);

  const loadTable = async () => {
    try {
      setLoading(true);
      setMessage("");
      setUsingFallback(false);

      const res = await API.get(`/standings/${leagueId}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        setTable(FALLBACK_STANDINGS[leagueId] || []);
        setUsingFallback(true);
        setMessage(
          "Live standings could not be loaded right now. Showing saved sample standings."
        );
        return;
      }

      const standings =
        res.data?.response?.[0]?.league?.standings?.[0] || [];

      if (standings.length === 0) {
        setTable(FALLBACK_STANDINGS[leagueId] || []);
        setUsingFallback(true);
        setMessage(
          "No live standings are available right now. Showing saved sample standings."
        );
        return;
      }

      setTable(standings);
    } catch (error) {
      console.error("Standings error:", error);
      setTable(FALLBACK_STANDINGS[leagueId] || []);
      setUsingFallback(true);
      setMessage(
        "Unable to connect to the backend. Showing saved sample standings."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>📊 {selectedLeague} Table</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
        View league tables, points, matches played, wins, draws, and losses.
      </p>

      <select
        value={leagueId}
        onChange={(e) => setLeagueId(Number(e.target.value))}
        style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "12px",
          border: "1px solid #334155",
          width: "100%",
          maxWidth: "360px",
          background: "#1e293b",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      {message && (
        <div
          style={{
            background: usingFallback ? "#78350f" : "#7f1d1d",
            color: usingFallback ? "#fde68a" : "white",
            padding: "16px",
            borderRadius: "14px",
            marginBottom: "20px",
            maxWidth: "720px",
          }}
        >
          {message}
        </div>
      )}

      {table.length === 0 ? (
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
          <h2 style={{ color: "white", marginTop: 0 }}>
            No standings available
          </h2>
          <p style={{ marginBottom: 0 }}>
            Try another league or check back later.
          </p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#1e293b",
            borderRadius: "16px",
            border: "1px solid #263449",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "640px",
              borderCollapse: "collapse",
              color: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Team</th>
                <th style={thStyle}>Pts</th>
                <th style={thStyle}>GD</th>
                <th style={thStyle}>P</th>
                <th style={thStyle}>W</th>
                <th style={thStyle}>D</th>
                <th style={thStyle}>L</th>
              </tr>
            </thead>

            <tbody>
              {table.map((team) => (
                <tr
                  key={team.team.id}
                  style={{
                    borderTop: "1px solid #263449",
                  }}
                >
                  <td style={tdStyle}>{team.rank}</td>

                  <td style={{ ...tdStyle, textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={team.team.logo}
                        alt={team.team.name}
                        width="30"
                        height="30"
                        style={{
                          objectFit: "contain",
                          background: "white",
                          borderRadius: "50%",
                          padding: "4px",
                          flexShrink: 0,
                        }}
                      />
                      <span>{team.team.name}</span>
                    </div>
                  </td>

                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {team.points}
                  </td>
                  <td style={tdStyle}>{team.goalsDiff ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.played ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.win ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.draw ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.lose ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#cbd5e1",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#e2e8f0",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

export default Standings;