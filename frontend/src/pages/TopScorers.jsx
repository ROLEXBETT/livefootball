import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function TopScorers() {

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await API.get("/topscorers/39");
      setPlayers(res.data.response || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>⚽ Top Scorers</h1>

      {players.length === 0 ? (
        <p>No top scorers found.</p>
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
                width="60"
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

export default TopScorers;
