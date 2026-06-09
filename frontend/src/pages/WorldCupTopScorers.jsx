import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupTopScorers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScorers();
  }, []);

  const loadScorers = async () => {
    try {
      const res = await API.get("/worldcup/topscorers");
      setPlayers(res.data.response || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPlayers = [...players].sort(
    (a, b) =>
      (b.statistics[0]?.goals?.total || 0) -
      (a.statistics[0]?.goals?.total || 0)
  );
  const topPlayers = sortedPlayers.slice(0, 3);

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>⚽ World Cup Top Scorers</h1>

      {topPlayers.length > 0 && (
        <div
          style={{
            background: "#111827",
            padding: "18px",
            borderRadius: "16px",
            marginBottom: "24px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          <h2 style={{ margin: 0 }}>🥇 Golden Boot Leader</h2>
          <h3 style={{ margin: "8px 0 0 0" }}>
            {topPlayers[0]?.player?.name || "N/A"}
          </h3>
          <h4 style={{ margin: "6px 0 0 0" }}>
            {topPlayers[0]?.statistics?.[0]?.goals?.total ?? 0} Goals
          </h4>
        </div>
      )}

      {topPlayers.length > 0 && (
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          {topPlayers.map((player, index) => (
            <div
              key={player.player.id}
              style={{
                background: "#0f172a",
                padding: "14px",
                borderRadius: "12px",
                flex: "1 1 180px",
              }}
            >
              <strong>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {player.player.name}
              </strong>
              <p style={{ margin: "8px 0 0 0" }}>
                {player.statistics[0]?.goals?.total ?? 0} Goals
              </p>
            </div>
          ))}
        </div>
      )}

      {players.length === 0 ? (
        <p>No scorers found.</p>
      ) : (
        players.map((player) => (
          <div
            key={player.player.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {player.player.photo && (
              <img
                src={player.player.photo}
                width="70"
                alt={player.player.name}
                style={{ borderRadius: "50%" }}
              />
            )}

            <div>
              <h3 style={{ margin: 0 }}>{player.player.name}</h3>
              <p style={{ margin: "6px 0 0" }}>
                Goals: {player.statistics[0]?.goals?.total ?? "N/A"}
              </p>
              <p style={{ margin: "6px 0 0" }}>
                Team: {player.statistics[0]?.team?.name || "Unknown"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default WorldCupTopScorers;
