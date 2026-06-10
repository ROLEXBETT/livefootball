import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupTeamStats() {
  const { teamId } = useParams();

  const [stats, setStats] = useState(null);
  const [teamName, setTeamName] = useState("Team");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [teamId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/worldcup/teamstats/${teamId}`);

      if (res.data.errors && Object.keys(res.data.errors).length > 0) {
        setError("Unable to load team statistics right now.");
        setStats(null);
        return;
      }

      const response = res.data.response || null;

      if (response) {
        setStats(response);
        setTeamName(response.team?.name || "Team");
      } else {
        setStats(null);
      }
    } catch (error) {
      console.log("World Cup team stats error:", error);
      setError("Unable to connect to the backend.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>📊 Team Stats</h1>

        <div
          style={{
            background: "#7f1d1d",
            padding: "20px",
            borderRadius: "16px",
            marginTop: "20px",
          }}
        >
          <p>{error}</p>
        </div>

        <Link
          to="/worldcup/squads"
          style={{
            display: "inline-block",
            marginTop: "18px",
            background: "#2563eb",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Back to Squads
        </Link>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>📊 Team Stats</h1>

        <div
          style={{
            background: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            marginTop: "20px",
            color: "#cbd5e1",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>
            No team statistics found
          </h2>

          <p>
            Statistics are not available right now. This may happen if the API
            request limit has been reached.
          </p>
        </div>

        <Link
          to="/worldcup/squads"
          style={{
            display: "inline-block",
            marginTop: "18px",
            background: "#2563eb",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Back to Squads
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>📊 {teamName} Stats</h1>

      <p style={{ color: "#cbd5e1", marginTop: "8px", marginBottom: "24px" }}>
        World Cup team performance overview.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard
          title="Goals Scored"
          value={stats.goals?.for?.total?.total ?? "N/A"}
        />

        <StatCard
          title="Goals Conceded"
          value={stats.goals?.against?.total?.total ?? "N/A"}
        />

        <StatCard
          title="Wins"
          value={stats.fixtures?.wins?.total ?? "N/A"}
        />

        <StatCard
          title="Draws"
          value={stats.fixtures?.draws?.total ?? "N/A"}
        />

        <StatCard
          title="Losses"
          value={stats.fixtures?.loses?.total ?? "N/A"}
        />

        <StatCard
          title="Matches Played"
          value={stats.fixtures?.played?.total ?? "N/A"}
        />
      </div>

      <Link
        to="/worldcup/squads"
        style={{
          display: "inline-block",
          marginTop: "24px",
          background: "#2563eb",
          color: "white",
          padding: "12px 16px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Back to Squads
      </Link>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "22px",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    >
      <p style={{ color: "#cbd5e1", marginBottom: "8px" }}>{title}</p>

      <h2 style={{ fontSize: "34px", margin: 0 }}>{value}</h2>
    </div>
  );
}

export default WorldCupTeamStats;