import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

const FALLBACK_TEAM_STATS = {
  6: {
    team: { id: 6, name: "Brazil" },
    fixtures: {
      played: { total: 3 },
      wins: { total: 2 },
      draws: { total: 1 },
      loses: { total: 0 },
    },
    goals: {
      for: { total: { total: 7 } },
      against: { total: { total: 2 } },
    },
  },
  25: {
    team: { id: 25, name: "Argentina" },
    fixtures: {
      played: { total: 3 },
      wins: { total: 2 },
      draws: { total: 0 },
      loses: { total: 1 },
    },
    goals: {
      for: { total: { total: 6 } },
      against: { total: { total: 3 } },
    },
  },
  20: {
    team: { id: 20, name: "France" },
    fixtures: {
      played: { total: 3 },
      wins: { total: 2 },
      draws: { total: 0 },
      loses: { total: 1 },
    },
    goals: {
      for: { total: { total: 8 } },
      against: { total: { total: 4 } },
    },
  },
};

const DEFAULT_FALLBACK_STATS = {
  team: { name: "World Cup Team" },
  fixtures: {
    played: { total: 0 },
    wins: { total: 0 },
    draws: { total: 0 },
    loses: { total: 0 },
  },
  goals: {
    for: { total: { total: 0 } },
    against: { total: { total: 0 } },
  },
};

function WorldCupTeamStats() {
  const { teamId } = useParams();

  const [stats, setStats] = useState(null);
  const [teamName, setTeamName] = useState("Team");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadStats();
  }, [teamId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setMessage("");
      setUsingFallback(false);

      const res = await API.get(`/worldcup/teamstats/${teamId}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const response = res.data.response || null;

      if (!hasApiError && response) {
        setStats(response);
        setTeamName(response.team?.name || "Team");
        return;
      }

      loadFallbackStats(
        "Team statistics could not be loaded right now. Showing saved sample statistics."
      );
    } catch (error) {
      console.error("World Cup team stats error:", error);
      loadFallbackStats(
        ". Showing saved sample statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackStats = (fallbackMessage) => {
    const fallbackStats =
      FALLBACK_TEAM_STATS[teamId] || DEFAULT_FALLBACK_STATS;

    setStats(fallbackStats);
    setTeamName(fallbackStats.team?.name || "World Cup Team");
    setUsingFallback(true);
    setMessage(fallbackMessage);
  };

  if (loading) return <Loader />;

  if (!stats) {
    return (
      <div className="page">
        <h1>📊 Team Stats</h1>

        <EmptyState
          title="No team statistics found"
          text="Statistics are not available right now. Please check back later."
        />

        <BackButton />
      </div>
    );
  }

  const goalsFor = stats.goals?.for?.total?.total ?? "N/A";
  const goalsAgainst = stats.goals?.against?.total?.total ?? "N/A";
  const wins = stats.fixtures?.wins?.total ?? "N/A";
  const draws = stats.fixtures?.draws?.total ?? "N/A";
  const losses = stats.fixtures?.loses?.total ?? "N/A";
  const played = stats.fixtures?.played?.total ?? "N/A";

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
        ← Back to squads
      </Link>

      <h1>📊 {teamName} Stats</h1>

      <p style={{ color: "#cbd5e1", marginTop: "8px", marginBottom: "20px" }}>
        World Cup team performance overview.
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

      <div className="card-grid">
        <StatCard title="Goals Scored" value={goalsFor} />
        <StatCard title="Goals Conceded" value={goalsAgainst} />
        <StatCard title="Wins" value={wins} />
        <StatCard title="Draws" value={draws} />
        <StatCard title="Losses" value={losses} />
        <StatCard title="Matches Played" value={played} />
      </div>

      <div
        style={{
          background: "#1e293b",
          border: "1px solid #263449",
          borderRadius: "18px",
          padding: "20px",
          marginTop: "24px",
          maxWidth: "760px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Summary</h2>

        <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: 0 }}>
          {teamName} has played <strong>{played}</strong> match(es), scored{" "}
          <strong>{goalsFor}</strong> goal(s), and conceded{" "}
          <strong>{goalsAgainst}</strong> goal(s).
        </p>
      </div>

      <BackButton />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        border: "1px solid #263449",
        color: "white",
      }}
    >
      <p style={{ color: "#cbd5e1", margin: "0 0 8px" }}>{title}</p>

      <h2 style={{ fontSize: "34px", margin: 0 }}>{value}</h2>
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

function BackButton() {
  return (
    <Link
      to="/worldcup/squads"
      style={{
        display: "inline-block",
        marginTop: "24px",
        background: "#2563eb",
        color: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      Back to Squads
    </Link>
  );
}

export default WorldCupTeamStats;
