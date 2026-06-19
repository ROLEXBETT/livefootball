import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import { requestNotificationPermission } from "../firebaseMessaging";

const FALLBACK_TEAMS = {
  6: {
    team: {
      id: 6,
      name: "Brazil",
      country: "Brazil",
      founded: 1914,
      logo: "https://media.api-sports.io/football/teams/6.png",
    },
    venue: {
      name: "Maracanã",
      capacity: 78838,
      city: "Rio de Janeiro",
      image:
        "https://media.api-sports.io/football/venues/204.png",
    },
  },
  25: {
    team: {
      id: 25,
      name: "Argentina",
      country: "Argentina",
      founded: 1893,
      logo: "https://media.api-sports.io/football/teams/25.png",
    },
    venue: {
      name: "Estadio Monumental",
      capacity: 84567,
      city: "Buenos Aires",
      image:
        "https://media.api-sports.io/football/venues/9.png",
    },
  },
  20: {
    team: {
      id: 20,
      name: "France",
      country: "France",
      founded: 1919,
      logo: "https://media.api-sports.io/football/teams/2.png",
    },
    venue: {
      name: "Stade de France",
      capacity: 81338,
      city: "Saint-Denis",
      image:
        "https://media.api-sports.io/football/venues/671.png",
    },
  },
};

const DEFAULT_FALLBACK_TEAM = {
  team: {
    id: "fallback-team",
    name: "Team",
    country: "Unknown",
    founded: "N/A",
    logo: "",
  },
  venue: {
    name: "Unknown Stadium",
    capacity: "N/A",
    city: "Unknown",
    image: "",
  },
};

function TeamDetails() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchTeam();
    setIsSubscribed(false);
    setIsFavorite(false);
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setMessage("");
      setUsingFallback(false);

      const res = await API.get(`/team/${id}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const apiTeam = res.data?.response?.[0] || null;

      if (!hasApiError && apiTeam) {
        setTeam(apiTeam);
        return;
      }

      loadFallbackTeam(
        "Team details could not be loaded right now. Showing saved sample team data."
      );
    } catch (error) {
      console.error("Team details error:", error);
      loadFallbackTeam(
        ". Showing saved sample team data."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackTeam = (fallbackMessage) => {
    const fallbackTeam = FALLBACK_TEAMS[id] || DEFAULT_FALLBACK_TEAM;

    setTeam(fallbackTeam);
    setUsingFallback(true);
    setMessage(fallbackMessage);
  };

  const addFavorite = async () => {
    if (isFavoriting || isFavorite) return;

    setIsFavoriting(true);

    try {
      if (!team) throw new Error("No team");

      await API.post("/favorites", {
        team_id: team.team?.id,
        team_name: team.team?.name,
        team_logo: team.team?.logo,
      });

      setIsFavorite(true);
      alert("Added to favorites!");
    } catch (error) {
      console.error("Favorite team error:", error);
      alert("Failed to add to favorites.");
    } finally {
      setIsFavoriting(false);
    }
  };

  const subscribe = async () => {
    if (isSubscribing || isSubscribed) return;

    setIsSubscribing(true);

    try {
      const token = await requestNotificationPermission();

      if (!token) {
        alert("Notification permission denied");
        return;
      }

      if (!team) throw new Error("No team");

      await API.post("/subscribe", {
        team_id: team.team?.id,
        device_token: token,
      });

      setIsSubscribed(true);
      alert("Team followed successfully!");
    } catch (error) {
      console.error("Subscribe team error:", error);
      alert("Failed to subscribe to team alerts.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) return <Loader />;

  if (!team) {
    return (
      <div className="page">
        <h1>Team Details</h1>

        <EmptyState
          title="No team found"
          text="Team details are not available right now."
        />

        <Link to="/" style={backButtonStyle}>
          Back Home
        </Link>
      </div>
    );
  }

  const teamData = team.team || {};
  const venueData = team.venue || {};

  return (
    <div className="page">
      <Link to="/" style={topLinkStyle}>
        ← Back Home
      </Link>

      <div
        style={{
          background: "linear-gradient(135deg,#1e293b,#0f172a)",
          border: "1px solid #263449",
          borderRadius: "24px",
          padding: "clamp(22px, 6vw, 34px)",
          marginBottom: "24px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          textAlign: "center",
        }}
      >
        {teamData.logo ? (
          <img
            src={teamData.logo}
            alt={`${teamData.name || "Team"} logo`}
            style={{
              display: "block",
              margin: "0 auto",
              width: "120px",
              height: "120px",
              objectFit: "contain",
              background: "white",
              borderRadius: "50%",
              padding: "12px",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto",
              background: "#111827",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontWeight: "bold",
            }}
          >
            Team
          </div>
        )}

        <h1 style={{ marginTop: "18px", marginBottom: "8px" }}>
          {teamData.name || "Unknown Team"}
        </h1>

        <p style={{ color: "#cbd5e1", margin: 0 }}>
          {teamData.country || "Unknown Country"}
        </p>
      </div>

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

      <div style={buttonRowStyle}>
        <button
          onClick={addFavorite}
          disabled={isFavoriting || isFavorite}
          style={{
            ...buttonStyle,
            background: isFavorite ? "#10b981" : "#2563eb",
            cursor: isFavoriting || isFavorite ? "not-allowed" : "pointer",
            opacity: isFavoriting ? 0.7 : 1,
          }}
        >
          {isFavoriting
            ? "Saving..."
            : isFavorite
            ? "⭐ Favorited"
            : "⭐ Favorite"}
        </button>

        <button
          onClick={subscribe}
          disabled={isSubscribing || isSubscribed}
          style={{
            ...buttonStyle,
            background: isSubscribed ? "#059669" : "#2563eb",
            cursor: isSubscribing || isSubscribed ? "not-allowed" : "pointer",
            opacity: isSubscribing ? 0.7 : 1,
          }}
        >
          {isSubscribing
            ? "Connecting..."
            : isSubscribed
            ? "✔ Following"
            : "🔔 Follow Team"}
        </button>
      </div>

      <div className="card-grid">
        <InfoCard title="Country" value={teamData.country || "—"} />
        <InfoCard title="Founded" value={teamData.founded || "—"} />
        <InfoCard title="Stadium" value={venueData.name || "—"} />
        <InfoCard
          title="Capacity"
          value={
            venueData.capacity
              ? Number(venueData.capacity).toLocaleString()
              : "—"
          }
        />
        <InfoCard title="City" value={venueData.city || "—"} />
      </div>

      {venueData.image && (
        <div
          style={{
            marginTop: "24px",
            background: "#1e293b",
            borderRadius: "18px",
            padding: "12px",
            border: "1px solid #263449",
          }}
        >
          <img
            src={venueData.image}
            alt={venueData.name || "Venue"}
            style={{
              width: "100%",
              maxHeight: "360px",
              borderRadius: "14px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        padding: "18px",
        borderRadius: "18px",
        border: "1px solid #263449",
        color: "white",
      }}
    >
      <p style={{ color: "#94a3b8", margin: "0 0 8px" }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: "22px" }}>{value}</h2>
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

const topLinkStyle = {
  color: "#38bdf8",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "14px",
  fontWeight: "bold",
};

const backButtonStyle = {
  display: "inline-block",
  marginTop: "24px",
  background: "#2563eb",
  color: "white",
  padding: "12px 16px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "bold",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "24px",
};

const buttonStyle = {
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  minWidth: "150px",
};

export default TeamDetails;
