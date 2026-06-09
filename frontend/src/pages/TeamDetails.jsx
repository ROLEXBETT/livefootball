import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import { requestNotificationPermission } from "../firebaseMessaging";

function TeamDetails() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dynamic UI States
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchTeam();
    // Reset states if navigating between different teams
    setIsSubscribed(false);
    setIsFavorite(false);
  }, [id]); // Added id so changing teams re-triggers fetch

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/team/${id}`);
      setTeam(res.data?.response?.[0] || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async () => {
    if (isFavoriting) return;
    setIsFavoriting(true);

    try {
      if (!team) throw new Error('No team');

      await API.post("/favorites", {
        team_id: team.team?.id,
        team_name: team.team?.name,
        team_logo: team.team?.logo,
      });
      setIsFavorite(true);
      alert("Added to favorites!");
    } catch (error) {
      console.log(error);
      alert("Failed to add to favorites.");
    } finally {
      setIsFavoriting(false);
    }
  };

  const subscribe = async () => {
    if (isSubscribing || isSubscribed) return;
    setIsSubscribing(true);

    try {
      // 1. Get Firebase token
      const token = await requestNotificationPermission();

      if (!token) {
        alert("Notification permission denied");
        return;
      }

      // 2. Send payload to backend
      if (!team) throw new Error('No team');

      await API.post("/subscribe", {
        team_id: team.team?.id,
        device_token: token,
      });

      setIsSubscribed(true);
      alert("Team followed successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to subscribe to team alerts.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) return <Loader />;
  if (!team) return <h2>No Team Found</h2>;

  const teamData = team.team || {};
  const venueData = team.venue || {};

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
      }}
    >
      {teamData.logo && (
        <img
          src={teamData.logo}
          width="140"
          alt="Team logo"
          style={{
            display: "block",
            margin: "auto",
            width: "100%",
            maxWidth: "140px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      )}

      <h1 style={{ textAlign: "center", marginTop: "18px" }}>
        {teamData.name || "Unknown Team"}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "24px",
          marginTop: "20px",
        }}
      >
        {/* Favorite Button */}
        <button
          onClick={addFavorite}
          disabled={isFavoriting || isFavorite}
          style={{
            background: isFavorite ? "#10b981" : "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: (isFavoriting || isFavorite) ? "not-allowed" : "pointer",
            opacity: isFavoriting ? 0.7 : 1,
            transition: "background 0.3s ease",
          }}
        >
          {isFavoriting ? "Saving..." : isFavorite ? "⭐ Favorited" : "⭐ Favorite"}
        </button>

        {/* Follow/Notification Button */}
        <button
          onClick={subscribe}
          disabled={isSubscribing || isSubscribed}
          style={{
            background: isSubscribed ? "#059669" : "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "8px",
            cursor: (isSubscribing || isSubscribed) ? "not-allowed" : "pointer",
            opacity: isSubscribing ? 0.7 : 1,
            transition: "background 0.3s ease",
          }}
        >
          {isSubscribing ? "Connecting..." : isSubscribed ? "✔ Following" : "🔔 Follow Team"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ background: "#111827", padding: "16px", borderRadius: "16px" }}>
          <h3>Country</h3>
          <p>{teamData.country || "—"}</p>
        </div>
        <div style={{ background: "#111827", padding: "16px", borderRadius: "16px" }}>
          <h3>Founded</h3>
          <p>{teamData.founded || "—"}</p>
        </div>
        <div style={{ background: "#111827", padding: "16px", borderRadius: "16px" }}>
          <h3>Stadium</h3>
          <p>{venueData.name || "—"}</p>
        </div>
        <div style={{ background: "#111827", padding: "16px", borderRadius: "16px" }}>
          <h3>Capacity</h3>
          <p>{venueData.capacity || "—"}</p>
        </div>
      </div>

      {team.venue.image && (
        <img
          src={team.venue.image}
          alt="Venue"
          style={{
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            borderRadius: "18px",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}

export default TeamDetails;