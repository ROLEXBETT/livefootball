import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";


function PlayerDetails() {

  const { id } = useParams();

  const [player, setPlayer] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {

    try {

      const res = await API.get(
        `/player/${id}`
      );

      setPlayer(
        res.data.response[0]
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!player) return <h2>No Player Found</h2>;

  const info = player.player;

  return (
    <div style={{ padding: "20px" }}>

      <img
        src={info.photo}
        alt=""
        width="150"
      />

      <h1>
        {info.name}
      </h1>

      <p>
        Age: {info.age}
      </p>

      <p>
        Nationality: {info.nationality}
      </p>

      <p>
        Height: {info.height}
      </p>

      <p>
        Weight: {info.weight}
      </p>

      <p>
        Birth: {info.birth.date}
      </p>

    </div>
  );
}

export default PlayerDetails;
