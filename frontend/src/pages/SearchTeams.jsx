import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function SearchTeams() {

  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState([]);

  const searchTeam = async () => {

    if (!query.trim()) return;

    try {

      const res = await API.get(
        `/search/${query}`
      );

      setTeams(res.data.response);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Search Teams</h1>

      <input
        type="text"
        placeholder="Manchester United"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      <button
        onClick={searchTeam}
        style={{
          marginLeft: "10px"
        }}
      >
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {teams.map(item => (

          <Link
            key={item.team.id}
            to={`/team/${item.team.id}`}
            style={{
              textDecoration: "none",
              color: "black"
            }}
          >

            <div
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "15px",
                borderRadius: "10px"
              }}
            >

              <img
                src={item.team.logo}
                alt=""
                width="40"
              />

              <h3>
                {item.team.name}
              </h3>

              <p>
                {item.team.country}
              </p>

            </div>

          </Link>

        ))}
      </div>

    </div>
  );
}

export default SearchTeams;
