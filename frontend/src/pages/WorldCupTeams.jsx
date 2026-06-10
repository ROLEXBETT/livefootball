import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setUsingFallback(false);

      const res = await API.get("/worldcup/teams");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const apiTeams = res.data.response || [];

      if (!hasApiError && apiTeams.length > 0) {
        setTeams(apiTeams);
      } else {
        setTeams(FALLBACK_WORLD_CUP_TEAMS);
        setUsingFallback(true);
      }
    } catch (error) {
      console.log("World Cup teams error:", error);
      setTeams(FALLBACK_WORLD_CUP_TEAMS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "24px" }}>
      <h1>👥 World Cup Squads</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "16px" }}>
        Select a country to view its World Cup squad.
      </p>

      {usingFallback && (
        <div
          style={{
            background: "#78350f",
            color: "#fde68a",
            padding: "14px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            maxWidth: "760px",
          }}
        >
          API limit reached or teams could not be loaded. Showing saved World Cup
          teams for now.
        </div>
      )}

      {teams.length === 0 ? (
        <p>No World Cup teams available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {teams.map((item) => {
            const team = item.team || item;

            return (
              <Link
                key={team.id}
                to={`/worldcup/squad/${team.id}`}
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "20px",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={team.logo}
                  alt={team.name}
                  style={{
                    width: "44px",
                    height: "44px",
                    objectFit: "contain",
                  }}
                />

                <strong>{team.name}</strong>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const FALLBACK_WORLD_CUP_TEAMS = [
  {
    team: {
      id: 1569,
      name: "Qatar",
      logo: "https://media.api-sports.io/football/teams/1569.png",
    },
  },
  {
    team: {
      id: 2384,
      name: "Ecuador",
      logo: "https://media.api-sports.io/football/teams/2384.png",
    },
  },
  {
    team: {
      id: 21,
      name: "England",
      logo: "https://media.api-sports.io/football/teams/21.png",
    },
  },
  {
    team: {
      id: 22,
      name: "Iran",
      logo: "https://media.api-sports.io/football/teams/22.png",
    },
  },
  {
    team: {
      id: 13,
      name: "Senegal",
      logo: "https://media.api-sports.io/football/teams/13.png",
    },
  },
  {
    team: {
      id: 1118,
      name: "Netherlands",
      logo: "https://media.api-sports.io/football/teams/1118.png",
    },
  },
  {
    team: {
      id: 25,
      name: "Argentina",
      logo: "https://media.api-sports.io/football/teams/25.png",
    },
  },
  {
    team: {
      id: 26,
      name: "Saudi Arabia",
      logo: "https://media.api-sports.io/football/teams/26.png",
    },
  },
  {
    team: {
      id: 20,
      name: "France",
      logo: "https://media.api-sports.io/football/teams/20.png",
    },
  },
  {
    team: {
      id: 6,
      name: "Brazil",
      logo: "https://media.api-sports.io/football/teams/6.png",
    },
  },
  {
    team: {
      id: 3,
      name: "Croatia",
      logo: "https://media.api-sports.io/football/teams/3.png",
    },
  },
  {
    team: {
      id: 9,
      name: "Portugal",
      logo: "https://media.api-sports.io/football/teams/9.png",
    },
  },
  {
    team: {
      id: 10,
      name: "Spain",
      logo: "https://media.api-sports.io/football/teams/10.png",
    },
  },
  {
    team: {
      id: 15,
      name: "Uruguay",
      logo: "https://media.api-sports.io/football/teams/15.png",
    },
  },
  {
    team: {
      id: 31,
      name: "Germany",
      logo: "https://media.api-sports.io/football/teams/31.png",
    },
  },
  {
    team: {
      id: 767,
      name: "Morocco",
      logo: "https://media.api-sports.io/football/teams/767.png",
    },
  },
];

export default WorldCupTeams;