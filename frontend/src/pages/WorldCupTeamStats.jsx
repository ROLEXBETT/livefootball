import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupTeamStats() {
  const { teamId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [teamId]);

  const loadStats = async () => {
    try {
      const res = await API.get(`/worldcup/teamstats/${teamId}`);
      setStats(res.data.response?.[0] || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!stats) return <p>No team statistics found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{stats.team?.name || "Team"} Stats</h1>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        }}
      >
        <h2>Goals Scored: {stats.goals?.for?.total?.total ?? "N/A"}</h2>
        <h2>Goals Conceded: {stats.goals?.against?.total?.total ?? "N/A"}</h2>
        <h2>Wins: {stats.fixtures?.wins?.total ?? "N/A"}</h2>
        <h2>Draws: {stats.fixtures?.draws?.total ?? "N/A"}</h2>
        <h2>Losses: {stats.fixtures?.loses?.total ?? "N/A"}</h2>
      </div>
    </div>
  );
}

export default WorldCupTeamStats;
