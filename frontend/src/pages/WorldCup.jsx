import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCup() {

  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorldCup();
  }, []);

  const loadWorldCup = async () => {
    try {
      const fixturesRes = await API.get("/worldcup/fixtures");
      const standingsRes = await API.get("/worldcup/standings");

      setFixtures(fixturesRes.data.response || []);
      const groups = standingsRes.data.response || [];
      setStandings(groups);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌎 FIFA World Cup Hub</h1>

      <h2>📅 Fixtures</h2>

      {fixtures.length === 0 ? (
        <p>No fixtures available.</p>
      ) : (
        fixtures.map((match) => (
          <div
            key={match.fixture.id}
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>
              {match.teams.home.name} vs {match.teams.away.name}
            </h3>
            <p style={{ margin: "0", color: "#cbd5e1" }}>
              {new Date(match.fixture.date).toLocaleString()}
            </p>
          </div>
        ))
      )}

      <h2 style={{ marginTop: "30px" }}>📊 Group Standings</h2>

      {standings.length === 0 ? (
        <p>No standings available.</p>
      ) : (
        standings.map((group) => (
          <div
            key={group.league.id}
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0" }}>
              {group.league.name}
            </h3>

            {group.league.standings && group.league.standings[0] && (
              <div>
                {group.league.standings[0].map((team) => (
                  <div
                    key={team.team.id}
                    style={{
                      background: "#0f172a",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {team.rank}. {team.team.name}
                    </span>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>
                      {team.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default WorldCup;
