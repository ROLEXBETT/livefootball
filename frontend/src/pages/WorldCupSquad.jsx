import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import { requestNotificationPermission } from "../firebaseMessaging";

const FALLBACK_SQUADS = {
  6: {
    team: { name: "Brazil" },
    players: [
      { id: 1, name: "Alisson", age: 33, position: "Goalkeeper", number: 1 },
      { id: 2, name: "Marquinhos", age: 32, position: "Defender", number: 4 },
      { id: 3, name: "Bruno Guimarães", age: 28, position: "Midfielder", number: 5 },
      { id: 4, name: "Vinícius Júnior", age: 25, position: "Attacker", number: 7 },
      { id: 5, name: "Rodrygo", age: 25, position: "Attacker", number: 11 },
    ],
  },
  26: {
    team: { name: "Argentina" },
    players: [
      { id: 6, name: "Emiliano Martínez", age: 33, position: "Goalkeeper", number: 23 },
      { id: 7, name: "Cristian Romero", age: 28, position: "Defender", number: 13 },
      { id: 8, name: "Enzo Fernández", age: 25, position: "Midfielder", number: 8 },
      { id: 9, name: "Lionel Messi", age: 39, position: "Attacker", number: 10 },
      { id: 10, name: "Lautaro Martínez", age: 28, position: "Attacker", number: 22 },
    ],
  },
  2: {
    team: { name: "France" },
    players: [
      { id: 11, name: "Mike Maignan", age: 30, position: "Goalkeeper", number: 16 },
      { id: 12, name: "William Saliba", age: 25, position: "Defender", number: 17 },
      { id: 13, name: "Aurélien Tchouaméni", age: 26, position: "Midfielder", number: 8 },
      { id: 14, name: "Kylian Mbappé", age: 27, position: "Attacker", number: 10 },
      { id: 15, name: "Ousmane Dembélé", age: 29, position: "Attacker", number: 11 },
    ],
  },
};

const DEFAULT_FALLBACK_SQUAD = {
  team: { name: "World Cup Team" },
  players: [
    { id: "fallback-1", name: "Goalkeeper", age: "N/A", position: "Goalkeeper", number: 1 },
    { id: "fallback-2", name: "Defender", age: "N/A", position: "Defender", number: 4 },
    { id: "fallback-3", name: "Midfielder", age: "N/A", position: "Midfielder", number: 8 },
    { id: "fallback-4", name: "Forward", age: "N/A", position: "Attacker", number: 9 },
  ],
};

function WorldCupSquad() {
  const { teamId } = useParams();

  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadSquad();
  }, [teamId]);

  const loadSquad = async () => {
    try {
      setLoading(true);
      setMessage("");
      setUsingFallback(false);

      const res = await API.get(`/worldcup/squad/${teamId}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const squad = res.data.response?.[0];

      if (!hasApiError && squad) {
        setTeamName(squad.team?.name || "Unknown Team");
        setPlayers(squad.players || []);
        return;
      }

      loadFallbackSquad(
        "Squad data could not be loaded right now. Showing saved sample squad data."
      );
    } catch (error) {
      console.error("World Cup squad error:", error);
      loadFallbackSquad(
        "Unable to connect to the backend. Showing saved sample squad data."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackSquad = (fallbackMessage) => {
    const fallbackSquad = FALLBACK_SQUADS[teamId] || DEFAULT_FALLBACK_SQUAD;

    setTeamName(fallbackSquad.team.name);
    setPlayers(fallbackSquad.players);
    setUsingFallback(true);
    setMessage(fallbackMessage);
  };

  const followTeam = async () => {
    if (isFollowing || followed) return;

    if (!teamName) {
      alert("Team name is not available yet.");
      return;
    }

    setIsFollowing(true);

    try {
      const token = await requestNotificationPermission();

      if (!token) {
        alert("Notification permission was not granted.");
        return;
      }

      await API.post("/worldcup/follow", {
        team_id: teamId,
        team_name: teamName,
        device_token: token,
      });

      setFollowed(true);
      alert("You will now receive World Cup goal alerts for this team.");
    } catch (error) {
      console.error("Follow team error:", error);
      alert("Unable to follow team.");
    } finally {
      setIsFollowing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <Link
        to="/worldcup/squads"
        style={{
          color: "#38bdf8",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "14px",
          fontWeight: "bold",
        }}
      >
        ← Back to teams
      </Link>

      <h1>👥 {teamName || "World Cup Team"} Squad</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
        View players, positions, shirt numbers, and follow this team for alerts.
      </p>

      {message && (
        <div
          style={{
            background: usingFallback ? "#78350f" : "#7f1d1d",
            color: usingFallback ? "#fde68a" : "white",
            padding: "16px",
            borderRadius: "14px",
            marginBottom: "20px",
            maxWidth: "760px",
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={followTeam}
        disabled={isFollowing || followed}
        style={{
          background: followed ? "#10b981" : "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 16px",
          borderRadius: "12px",
          cursor: isFollowing || followed ? "not-allowed" : "pointer",
          marginBottom: "24px",
          fontWeight: "bold",
          width: "100%",
          maxWidth: "260px",
        }}
      >
        {isFollowing
          ? "Subscribing..."
          : followed
          ? "🔔 Following"
          : "🔔 Follow Team"}
      </button>

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
          <h2 style={{ color: "white", marginTop: 0 }}>No players found</h2>
          <p style={{ marginBottom: 0 }}>
            Squad data is not available for this team right now.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {players.map((player, index) => (
            <div
              key={player.id || `${player.name}-${index}`}
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "18px",
                border: "1px solid #263449",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "50%",
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38bdf8",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  #{player.number || "-"}
                </div>

                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      lineHeight: 1.2,
                    }}
                  >
                    {player.name}
                  </h2>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    {player.position || "N/A"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <InfoBox label="Age" value={player.age || "N/A"} />
                <InfoBox label="Number" value={player.number || "N/A"} />
              </div>
            </div>
          ))}
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

      <strong>{value}</strong>
    </div>
  );
}

export default WorldCupSquad;