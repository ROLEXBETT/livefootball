import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(fetchMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get("/live");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        setMatches([]);
        return;
      }

      setMatches(res.data.response || []);
    } catch (error) {
      console.error("Live matches error:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>🔴 Live Matches</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Follow live football scores and match updates.
      </p>

      {matches.length === 0 ? (
        <div
          style={{
            background: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            marginTop: "20px",
            color: "#cbd5e1",
            maxWidth: "720px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>
            No live matches right now
          </h2>

          <p>
            Live football matches will appear here automatically when games are
            being played. Check the World Cup fixtures or come back later.
          </p>

          <Link
            to="/worldcup"
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#2563eb",
              color: "white",
              padding: "12px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            View World Cup Fixtures
          </Link>
        </div>
      ) : (
        <div>
          {matches.map((match) => (
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveMatches;