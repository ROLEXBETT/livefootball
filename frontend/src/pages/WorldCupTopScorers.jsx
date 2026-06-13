import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

const FALLBACK_WORLD_CUP_SCORERS = [
  {
    player: {
      id: 278,
      name: "Kylian Mbappé",
      photo: "https://media.api-sports.io/football/players/278.png",
    },
    statistics: [
      {
        team: {
          name: "France",
          logo: "https://media.api-sports.io/football/teams/2.png",
        },
        goals: { total: 8 },
        games: { appearences: 7 },
      },
    ],
  },
  {
    player: {
      id: 154,
      name: "Lionel Messi",
      photo: "https://media.api-sports.io/football/players/154.png",
    },
    statistics: [
      {
        team: {
          name: "Argentina",
          logo: "https://media.api-sports.io/football/teams/25.png",
        },
        goals: { total: 7 },
        games: { appearences: 7 },
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
          name: "England",
          logo: "https://media.api-sports.io/football/teams/10.png",
        },
        goals: { total: 3 },
        games: { appearences: 5 },
      },
    ],
  },
  {
    player: {
      id: 306,
      name: "Olivier Giroud",
      photo: "https://media.api-sports.io/football/players/306.png",
    },
    statistics: [
      {
        team: {
          name: "France",
          logo: "https://media.api-sports.io/football/teams/2.png",
        },
        goals: { total: 4 },
        games: { appearences: 6 },
      },
    ],
  },
];

function WorldCupTopScorers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadScorers();
  }, []);

  const loadScorers = async () => {
    try {
      setMessage("");
      setUsingFallback(false);

      const res = await API.get("/worldcup/topscorers");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const scorers = res.data.response || [];

      if (!hasApiError && scorers.length > 0) {
        setPlayers(scorers);
        return;
      }

      setPlayers(FALLBACK_WORLD_CUP_SCORERS);
      setUsingFallback(true);
      setMessage(
        "World Cup top scorers could not be loaded right now. Showing saved sample data."
      );
    } catch (error) {
      console.error("World Cup top scorers error:", error);
      setPlayers(FALLBACK_WORLD_CUP_SCORERS);
      setUsingFallback(true);
      setMessage(
        "Unable to connect to the backend. Showing saved World Cup top scorers."
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedPlayers = [...players].sort(
    (a, b) =>
      (b.statistics?.[0]?.goals?.total || 0) -
      (a.statistics?.[0]?.goals?.total || 0)
  );

  const topPlayers = sortedPlayers.slice(0, 3);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>⚽ World Cup Top Scorers</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Track the leading World Cup goal scorers and Golden Boot race.
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

      {topPlayers.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg,#92400e,#111827)",
            padding: "22px",
            borderRadius: "18px",
            marginBottom: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            border: "1px solid #78350f",
          }}
        >
          <p
            style={{
              color: "#fde68a",
              margin: "0 0 8px",
              fontWeight: "bold",
            }}
          >
            🥇 Golden Boot Leader
          </p>

          <h2 style={{ margin: 0 }}>{topPlayers[0]?.player?.name || "N/A"}</h2>

          <h3 style={{ margin: "8px 0 0 0", color: "#fde68a" }}>
            {topPlayers[0]?.statistics?.[0]?.goals?.total ?? 0} Goals
          </h3>
        </div>
      )}

      {topPlayers.length > 0 && (
        <div className="card-grid" style={{ marginBottom: "24px" }}>
          {topPlayers.map((player, index) => (
            <div
              key={player.player.id || `${player.player.name}-${index}`}
              style={{
                background: "#0f172a",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #263449",
              }}
            >
              <strong>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}{" "}
                {player.player.name}
              </strong>

              <p style={{ margin: "8px 0 0 0", color: "#cbd5e1" }}>
                {player.statistics?.[0]?.goals?.total ?? 0} Goals
              </p>
            </div>
          ))}
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
          <h2 style={{ color: "white", marginTop: 0 }}>No scorers found</h2>

          <p style={{ marginBottom: 0 }}>
            Top scorer data is not available right now. Please check back later.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {sortedPlayers.map((player, index) => {
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
                  <InfoBox label="Goals" value={goals} />
                  <InfoBox label="Games" value={appearances} />
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

function InfoBox({ label, value }) {
  return (
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
        {label}
      </p>

      <strong style={{ fontSize: "22px" }}>{value}</strong>
    </div>
  );
}

export default WorldCupTopScorers;