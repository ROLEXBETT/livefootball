import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function WorldCupTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setUsingFallback(false);
      setMessage("");

      const res = await API.get("/worldcup/teams");

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      const apiTeams = res.data.response || [];

      if (!hasApiError && apiTeams.length > 0) {
        setTeams(apiTeams);
      } else {
        setTeams(FALLBACK_WORLD_CUP_TEAMS);
        setUsingFallback(true);
        setMessage("");
      }
    } catch (error) {
      console.error("World Cup teams error:", error);
      setTeams(FALLBACK_WORLD_CUP_TEAMS);
      setUsingFallback(true);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1>👥 World Cup Squads</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
        Select a country to view its World Cup squad.
      </p>

      {message && (
        <div
          style={{
            background: usingFallback ? "#78350f" : "#7f1d1d",
            color: usingFallback ? "#fde68a" : "white",
            padding: "16px",
            borderRadius: "14px",
            marginBottom: "24px",
            maxWidth: "760px",
          }}
        >
          {message}
        </div>
      )}

      {teams.length === 0 ? (
        <div
          style={{
            background: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #263449",
            color: "#cbd5e1",
            maxWidth: "640px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0 }}>
            No World Cup teams available
          </h2>

          <p style={{ marginBottom: 0 }}>
            Team data is not available right now. Please check back later.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {teams.map((item) => {
            const team = item.team || item;

            return (
              <Link
                key={team.id}
                to={`/worldcup/squad/${team.id}`}
                style={{
                  background: "#1e293b",
                  borderRadius: "18px",
                  padding: "20px",
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  border: "1px solid #263449",
                  minHeight: "96px",
                }}
              >
                <img
                  src={team.logo}
                  alt={team.name}
                  style={{
                    width: "52px",
                    height: "52px",
                    objectFit: "contain",
                    background: "white",
                    borderRadius: "50%",
                    padding: "6px",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      lineHeight: 1.2,
                    }}
                  >
                    {team.name}
                  </h2>

                  <p
                    style={{
                      color: "#94a3b8",
                      margin: "6px 0 0",
                      fontSize: "14px",
                    }}
                  >
                    View squad →
                  </p>
                </div>
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
