import { useEffect, useState } from "react";
import dayjs from "dayjs";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupBracket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBracket();
  }, []);

  const loadBracket = async () => {
    try {
      const res = await API.get("/worldcup/knockout");
      const fixtures = res.data.response || [];

      const knockout = fixtures.filter((match) => {
        const round = match.league?.round || "";
        return (
          round.includes("Round of 16") ||
          round.includes("Quarter-finals") ||
          round.includes("Semi-finals") ||
          round.includes("Final")
        );
      });

      setMatches(knockout);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏆 World Cup Knockout Stage</h1>

      {matches.length === 0 ? (
        <p>No knockout matches found.</p>
      ) : (
        matches.map((match) => (
          <div
            key={match.fixture.id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>
              {match.league?.round || "Match"}
            </h3>

            <p style={{ margin: 0 }}>
              <strong>{match.teams?.home?.name || "TBD"}</strong>{" "}
              {match.goals?.home ?? "—"} {" - "}
              {match.goals?.away ?? "—"}{" "}
              <strong>{match.teams?.away?.name || "TBD"}</strong>
            </p>

            <p style={{ margin: "8px 0 0 0", color: "#cbd5e1", fontSize: "14px" }}>
              {new Date(match.fixture?.date).toLocaleString()}
            </p>
            <p style={{ margin: "6px 0 0 0", color: "#f8fafc", fontSize: "14px" }}>
              {dayjs(match.fixture?.date).isBefore(dayjs())
                ? "LIVE 🔴"
                : `⏳ ${dayjs(match.fixture?.date).diff(dayjs(), "hour")} hours remaining`}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default WorldCupBracket;
