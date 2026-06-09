import { useEffect, useState } from "react";
import API from "../services/api";

function MatchStatistics({ fixtureId }) {

  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const res = await API.get(
        `/match-stats/${fixtureId}`
      );

      setStats(
        res.data.response
      );

    } catch (error) {

      console.log(error);

    }
  };

  if (!stats.length)
    return <p>No Statistics Available</p>;

  const home = stats[0];
  const away = stats[1];

  return (
    <div style={{ marginTop: "30px" }}>

      <h2>Match Statistics</h2>

      {home.statistics.map((stat, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "12px",
            borderBottom:
              "1px solid #ddd",
            paddingBottom: "6px"
          }}
        >

          <span>
            {stat.value || 0}
          </span>

          <strong>
            {stat.type}
          </strong>

          <span>
            {
              away.statistics[index]
                ?.value || 0
            }
          </span>

        </div>

      ))}

    </div>
  );
}

export default MatchStatistics;
