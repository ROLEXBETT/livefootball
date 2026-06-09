import { useEffect, useState } from "react";
import API from "../services/api";

function Favorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {

    loadFavorites();

  }, []);

  const loadFavorites = async () => {

    try {

      const res = await API.get(
        "/favorites"
      );

      setFavorites(
        res.data
      );

    } catch(error) {

      console.log(error);

    }
  };

  const removeFavorite = async (
    teamId
  ) => {

    try {

      await API.delete(
        `/favorites/${teamId}`
      );

      loadFavorites();

    } catch(error) {

      console.log(error);

    }
  };

  return (
    <div
      style={{
        padding:"20px"
      }}
    >

      <h1>
        Favorite Teams
      </h1>

      {favorites.map(team => (

        <div
          key={team.id}
          style={{
            border:"1px solid #ddd",
            padding:"15px",
            marginBottom:"15px",
            borderRadius:"10px"
          }}
        >

          <img
            src={team.team_logo}
            width="50"
          />

          <h3>
            {team.team_name}
          </h3>

          <button
            onClick={() =>
              removeFavorite(
                team.team_id
              )
            }
          >
            Remove
          </button>

        </div>

      ))}

    </div>
  );
}

export default Favorites;
