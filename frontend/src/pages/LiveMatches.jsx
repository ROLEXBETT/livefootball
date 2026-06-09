import { useEffect, useState } from "react";
import API from "../services/api";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get("/live");

      setMatches(res.data.response || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Matches</h1>

      {matches.length === 0 ? (
        <p>No live matches currently.</p>
      ) : (
        matches.map((match) => (
          <MatchCard
            key={match.fixture.id}
            match={match}
          />
        ))
      )}
    </div>
  );
}

export default LiveMatches;