import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function Standings() {
  const leagues = [
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 78, name: "Bundesliga" },
    { id: 135, name: "Serie A" },
    { id: 61, name: "Ligue 1" },
  ];

  const [leagueId, setLeagueId] = useState(39);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedLeague =
    leagues.find((league) => league.id === leagueId)?.name || "Standings";

  useEffect(() => {
    loadTable();
  }, [leagueId]);

  const loadTable = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/standings/${leagueId}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        setTable([]);
        return;
      }

      const standings =
        res.data?.response?.[0]?.league?.standings?.[0] || [];

      setTable(standings);
    } catch (error) {
      console.error("Standings error:", error);
      setTable([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>📊 {selectedLeague} Table</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
        View current league tables, points, matches played, wins, draws, and
        losses.
      </p>

      <select
        value={leagueId}
        onChange={(e) => setLeagueId(Number(e.target.value))}
        style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "12px",
          border: "1px solid #334155",
          width: "100%",
          maxWidth: "360px",
          background: "#1e293b",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      {table.length === 0 ? (
        <EmptyStandings selectedLeague={selectedLeague} />
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#1e293b",
            borderRadius: "16px",
            border: "1px solid #263449",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "640px",
              borderCollapse: "collapse",
              color: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <th style={thStyle}>#</th>
                <th style={{ ...thStyle, textAlign: "left" }}>Team</th>
                <th style={thStyle}>Pts</th>
                <th style={thStyle}>GD</th>
                <th style={thStyle}>P</th>
                <th style={thStyle}>W</th>
                <th style={thStyle}>D</th>
                <th style={thStyle}>L</th>
              </tr>
            </thead>

            <tbody>
              {table.map((team) => (
                <tr
                  key={team.team.id}
                  style={{
                    borderTop: "1px solid #263449",
                  }}
                >
                  <td style={tdStyle}>{team.rank}</td>

                  <td style={{ ...tdStyle, textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {team.team.logo ? (
                        <img
                          src={team.team.logo}
                          alt={team.team.name}
                          width="30"
                          height="30"
                          style={{
                            objectFit: "contain",
                            background: "white",
                            borderRadius: "50%",
                            padding: "4px",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#94a3b8",
                            fontSize: "12px",
                            flexShrink: 0,
                          }}
                        >
                          ?
                        </div>
                      )}

                      <span>{team.team.name}</span>
                    </div>
                  </td>

                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {team.points}
                  </td>
                  <td style={tdStyle}>{team.goalsDiff ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.played ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.win ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.draw ?? "-"}</td>
                  <td style={tdStyle}>{team.all?.lose ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyStandings({ selectedLeague }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #263449",
        color: "#cbd5e1",
        maxWidth: "720px",
      }}
    >
      <h2 style={{ color: "white", marginTop: 0 }}>
        Standings are currently being updated
      </h2>

      <p style={{ marginBottom: "12px", lineHeight: 1.6 }}>
        Current {selectedLeague} standings are not available right now.
      </p>

      <p style={{ marginBottom: 0, lineHeight: 1.6 }}>
        League tables will appear here automatically when current competition
        data is available.
      </p>
    </div>
  );
}

const thStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#cbd5e1",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#e2e8f0",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

export default Standings;