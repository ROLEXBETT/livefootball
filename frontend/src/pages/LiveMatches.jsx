import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(fetchMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setMessage("");

      const res = await API.get("/live");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        const apiLimitMessage = res.data.errors.requests;

        if (apiLimitMessage) {
          setMessage(
            "API request limit reached for today. Live scores will be available again when the API limit resets."
          );
        } else {
          setMessage("Unable to load live matches right now.");
        }

        setMatches([]);
        return;
      }

      setMatches(res.data.response || []);
    } catch (error) {
      console.error("Live matches error:", error);
      setMessage(
        "Unable to connect to the backend. Make sure your Flask server is running."
      );
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const isApiLimitMessage = message.includes("API request limit");

  return (
    <div style={{ padding: "24px" }}>
      <h1>🔴 Live Matches</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Follow live football scores and match updates.
      </p>

      {message && (
        <div
          style={{
            background: isApiLimitMessage ? "#78350f" : "#7f1d1d",
            color: isApiLimitMessage ? "#fde68a" : "white",
            padding: "18px",
            borderRadius: "14px",
            marginBottom: "20px",
            maxWidth: "640px",
          }}
        >
          {message}
        </div>
      )}

      {matches.length === 0 ? (
        <div
          style={{
            background: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            marginTop: "20px",
            color: "#cbd5e1",
            maxWidth: "640px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>
            No live matches right now
          </h2>

          <p>
            There are no football matches being played live at the moment. Check
            the World Cup fixtures or come back later.
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {matches.map((match) => (
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveMatches;