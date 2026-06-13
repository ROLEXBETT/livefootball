import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setMessage("");

      const res = await API.get("/favorites");

      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Favorites error:", error);
      setMessage(
        "Unable to load favorites right now. Make sure your backend is running."
      );
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (teamId) => {
    try {
      await API.delete(`/favorites/${teamId}`);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((team) => team.team_id !== teamId)
      );
    } catch (error) {
      console.error("Remove favorite error:", error);
      setMessage("Unable to remove this team right now.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>⭐ Favorite Teams</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Save your favorite teams and access them quickly from here.
      </p>

      {message && (
        <div
          style={{
            background: "#7f1d1d",
            color: "white",
            padding: "16px",
            borderRadius: "14px",
            marginBottom: "20px",
            maxWidth: "640px",
          }}
        >
          {message}
        </div>
      )}

      {favorites.length === 0 ? (
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
            No favorite teams yet
          </h2>

          <p style={{ marginBottom: 0 }}>
            When you save a team, it will appear here for quick access.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {favorites.map((team) => (
            <div
              key={team.id || team.team_id}
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
                  marginBottom: "18px",
                }}
              >
                <img
                  src={team.team_logo}
                  alt={team.team_name}
                  width="54"
                  height="54"
                  style={{
                    objectFit: "contain",
                    background: "white",
                    borderRadius: "50%",
                    padding: "6px",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <h2 style={{ margin: 0, fontSize: "20px" }}>
                    {team.team_name}
                  </h2>

                  <p
                    style={{
                      color: "#94a3b8",
                      margin: "4px 0 0",
                      fontSize: "14px",
                    }}
                  >
                    Favorite team
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFavorite(team.team_id)}
                style={{
                  width: "100%",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;