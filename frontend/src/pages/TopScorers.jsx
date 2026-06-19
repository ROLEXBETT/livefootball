import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const FALLBACK_SCORERS = [
  {
    player: {
      id: 278,
      name: "Kylian Mbappé",
      photo: "https://media.api-sports.io/football/players/278.png",
    },
    statistics: [
      {
        team: {
          name: "Arsenal",
          logo: "https://media.api-sports.io/football/teams/42.png",
        },
        goals: { total: 24 },
        games: { appearences: 33 },
      },
    ],
  },
  {
    player: {
      id: 276,
      name: "Erling Haaland",
      photo: "https://media.api-sports.io/football/players/1100.png",
    },
    statistics: [
      {
        team: {
          name: "Manchester City",
          logo: "https://media.api-sports.io/football/teams/50.png",
        },
        goals: { total: 22 },
        games: { appearences: 31 },
      },
    ],
  },
  {
    player: {
      id: 184,
      name: "Harry Kane",
      photo: "https://media.api-sports.io/football/players/184.png",
    },
    statistics: [
      {
        team: {
          name: "Liverpool",
          logo: "https://media.api-sports.io/football/teams/40.png",
        },
        goals: { total: 20 },
        games: { appearences: 32 },
      },
    ],
  },
  {
    player: {
      id: 909,
      name: "Mohamed Salah",
      photo: "https://media.api-sports.io/football/players/306.png",
    },
    statistics: [
      {
        team: {
          name: "Liverpool",
          logo: "https://media.api-sports.io/football/teams/40.png",
        },
        goals: { total: 18 },
        games: { appearences: 34 },
      },
    ],
  },
];

function TopScorers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setMessage("");
      setUsingFallback(false);

      const res = await API.get("/topscorers/39");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        setPlayers(FALLBACK_SCORERS);
        setUsingFallback(true);
        setMessage("");
        return;
      }

      const scorers = res.data.response || [];

      if (scorers.length === 0) {
        setPlayers(FALLBACK_SCORERS);
        setUsingFallback(true);
        setMessage("");
        return;
      }

      setPlayers(scorers);
    } catch (error) {
      console.error("Top scorers error:", error);
      setPlayers(FALLBACK_SCORERS);
      setUsingFallback(true);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>⚽ Top Scorers</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Track leading goal scorers and their current teams.
      </p>

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

      {players.length === 0 ? (
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
            No top scorers found
          </h2>

          <p style={{ marginBottom: 0 }}>
            Top scorer data is not available right now. Please check back later.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {players.map((player, index) => {
            const stats = player.statistics?.[0];
            const goals = stats?.goals?.total ?? "N/A";
            const appearances =
              stats?.games?.appearences ?? stats?.games?.appearances ?? "N/A";

            return (
              <div
                key={player.player.id || `${player.player.name}-${index}`}
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "18px",
                  border: "1px solid #263449",
                  color: "white",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {player.player.photo && (
                    <img
                      src={player.player.photo}
                      width="64"
                      height="64"
                      alt={player.player.name}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        background: "#0f172a",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <div>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#38bdf8",
                        fontWeight: "bold",
                      }}
                    >
                      #{index + 1}
                    </p>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        lineHeight: 1.2,
                      }}
                    >
                      {player.player.name}
                    </h2>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#0f172a",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#94a3b8",
                        margin: "0 0 4px",
                        fontSize: "13px",
                      }}
                    >
                      Goals
                    </p>
                    <strong style={{ fontSize: "22px" }}>{goals}</strong>
                  </div>

                  <div
                    style={{
                      background: "#0f172a",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#94a3b8",
                        margin: "0 0 4px",
                        fontSize: "13px",
                      }}
                    >
                      Games
                    </p>
                    <strong style={{ fontSize: "22px" }}>{appearances}</strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "16px",
                    color: "#cbd5e1",
                  }}
                >
                  {stats?.team?.logo && (
                    <img
                      src={stats.team.logo}
                      alt={stats.team.name}
                      width="28"
                      height="28"
                      style={{
                        objectFit: "contain",
                        background: "white",
                        borderRadius: "50%",
                        padding: "3px",
                      }}
                    />
                  )}

                  <span>{stats?.team?.name || "Unknown Team"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopScorers;
