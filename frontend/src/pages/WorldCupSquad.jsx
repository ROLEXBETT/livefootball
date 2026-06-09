import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import { requestNotificationPermission } from "../firebaseMessaging";

function WorldCupSquad() {
  const { teamId } = useParams();

  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    loadSquad();
  }, [teamId]);

  const loadSquad = async () => {
    try {
      const res = await API.get(`/worldcup/squad/${teamId}`);
      const squad = res.data.response?.[0];

      if (squad) {
        setTeamName(squad.team?.name || "Unknown Team");
        setPlayers(squad.players || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const followTeam = async () => {
    if (isFollowing || followed) return;
    setIsFollowing(true);

    try {
      const token = await requestNotificationPermission();
      if (!token) return;

      await API.post("/worldcup/follow", {
        team_id: teamId,
        team_name: teamName,
        device_token: token,
      });

      setFollowed(true);
      alert("You will now receive World Cup goal alerts for this team.");
    } catch (error) {
      console.log(error);
      alert("Unable to follow team.");
    } finally {
      setIsFollowing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{teamName} Squad</h1>

      <button
        onClick={followTeam}
        disabled={isFollowing || followed}
        style={{
          background: followed ? "#10b981" : "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "8px",
          cursor: isFollowing || followed ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {isFollowing
          ? "Subscribing..."
          : followed
          ? "🔔 Following"
          : "🔔 Follow Team"}
      </button>

      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        players.map((player) => (
          <div
            key={player.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{player.name}</h3>
            <p style={{ margin: "4px 0" }}>Age: {player.age || "N/A"}</p>
            <p style={{ margin: "4px 0" }}>
              Position: {player.position || "N/A"}
            </p>
            <p style={{ margin: "4px 0" }}>
              Number: {player.number || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default WorldCupSquad;
