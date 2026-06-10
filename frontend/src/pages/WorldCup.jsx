import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      setLoading(true);

      const fixturesRes = await API.get("/worldcup/fixtures");
      const standingsRes = await API.get("/worldcup/standings");

      setFixtures(fixturesRes.data.response || []);
      setStandings(standingsRes.data.response || []);
    } catch (error) {
      console.log("World Cup loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "24px" }}>
      <h1>🌎 FIFA World Cup Hub</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
        Fixtures, group standings, squads, stadiums, knockout bracket, team stats,
        and World Cup scorers.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <Link to="/worldcup/bracket" style={featureCardStyle}>
          <h2>🏆 Bracket</h2>
          <p>View knockout rounds and final path.</p>
        </Link>

        <Link to="/worldcup/stadiums" style={featureCardStyle}>
          <h2>🏟️ Stadiums</h2>
          <p>Explore World Cup host stadiums.</p>
        </Link>

        <Link to="/worldcup/topscorers" style={featureCardStyle}>
          <h2>⚽ Top Scorers</h2>
          <p>See leading World Cup goalscorers.</p>
        </Link>

        <Link to="/worldcup/squads" style={featureCardStyle}>
          <h2>👥 Squads</h2>
          <p>Select a country and view players.</p>
        </Link>

        <Link to="/worldcup/teamstats" style={featureCardStyle}>
          <h2>📊 Team Stats</h2>
          <p>Check country performance and stats.</p>
        </Link>

        <Link to="/live" style={featureCardStyle}>
          <h2>🔴 Live Matches</h2>
          <p>Follow live football scores.</p>
        </Link>
      </div>

      <h2>📅 Fixtures</h2>

      {fixtures.length === 0 ? (
        <p>No fixtures available.</p>
      ) : (
        <div style={gridStyle}>
          {fixtures.slice(0, 8).map((match) => (
            <Link
              key={match.fixture.id}
              to={`/match/${match.fixture.id}`}
              style={matchCardStyle}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                {match.teams.home.name} vs {match.teams.away.name}
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  margin: "14px 0",
                }}
              >
                <div style={teamStyle}>
                  <img
                    src={match.teams.home.logo}
                    alt={match.teams.home.name}
                    style={logoStyle}
                  />
                  <span>{match.teams.home.name}</span>
                </div>

                <strong style={{ fontSize: "24px" }}>
                  {match.goals.home ?? "-"} : {match.goals.away ?? "-"}
                </strong>

                <div style={teamStyle}>
                  <img
                    src={match.teams.away.logo}
                    alt={match.teams.away.name}
                    style={logoStyle}
                  />
                  <span>{match.teams.away.name}</span>
                </div>
              </div>

              <p style={{ margin: "0", color: "#cbd5e1" }}>
                {new Date(match.fixture.date).toLocaleString()}
              </p>

              <p style={{ margin: "8px 0 0 0", color: "#38bdf8" }}>
                {match.fixture.status.long}
              </p>
            </Link>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "36px" }}>📊 Group Standings</h2>

      {standings.length === 0 ? (
        <p>No standings available.</p>
      ) : (
        standings.map((group) => (
          <div key={group.league.id} style={sectionCardStyle}>
            <h3 style={{ margin: "0 0 16px 0" }}>{group.league.name}</h3>

            {group.league.standings?.map((standingGroup, index) => (
              <div key={index} style={{ marginBottom: "18px" }}>
                <h4 style={{ color: "#38bdf8" }}>
                  {standingGroup[0]?.group || `Group ${index + 1}`}
                </h4>

                {standingGroup.map((team) => (
                  <Link
                    key={team.team.id}
                    to={`/worldcup/teamstats/${team.team.id}`}
                    style={standingRowStyle}
                  >
                    <span>
                      {team.rank}.{" "}
                      <img
                        src={team.team.logo}
                        alt={team.team.name}
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                          verticalAlign: "middle",
                          marginRight: "6px",
                        }}
                      />
                      {team.team.name}
                    </span>

                    <span style={{ color: "#10b981", fontWeight: "bold" }}>
                      {team.points} pts
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

const featureCardStyle = {
  background: "#111827",
  padding: "20px",
  borderRadius: "14px",
  textDecoration: "none",
  color: "white",
  border: "1px solid #1f2937",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const matchCardStyle = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

const teamStyle = {
  width: "90px",
  textAlign: "center",
  fontSize: "14px",
};

const logoStyle = {
  width: "42px",
  height: "42px",
  objectFit: "contain",
  display: "block",
  margin: "0 auto 8px",
};

const sectionCardStyle = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

const standingRowStyle = {
  background: "#0f172a",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  textDecoration: "none",
};

export default WorldCup;