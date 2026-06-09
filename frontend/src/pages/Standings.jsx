import { useEffect, useState } from "react";
import API from "../services/api";

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

  useEffect(() => {
    loadTable();
  }, [leagueId]);

  const loadTable = async () => {

    try {

      const res = await API.get(
        `/standings/${leagueId}`
      );

      console.log(
        "Standings API:",
        JSON.stringify(res.data, null, 2)
      );

      console.log("Response:", res.data.response);
      console.log("First:", res.data.response?.[0]);

      const standings =
        res.data?.response?.[0]?.league?.standings?.[0] || [];

      setTable(standings);

    } catch (error) {
      console.log(error);
      setTable([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{leagues.find((league) => league.id === leagueId)?.name || "Standings"} Table</h1>

      <select
        value={leagueId}
        onChange={(e) => setLeagueId(Number(e.target.value))}
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Pts</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
          </tr>
        </thead>

        <tbody>
          {table.map(team => (
            <tr key={team.team.id}>
              <td>{team.rank}</td>
              <td>{team.team.name}</td>
              <td>{team.points}</td>
              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Standings;