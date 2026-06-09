import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import MatchStatistics from "../components/MatchStatistics";
import HeadToHead from "../components/HeadToHead";

function MatchDetails() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await API.get(`/match/${id}`);

      setMatch(res.data.response[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!match) return <h2>Match not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        {match.teams.home.name}
        {" vs "}
        {match.teams.away.name}
      </h1>

      <h2>
        {match.goals.home} - {match.goals.away}
      </h2>

      <p>
        Minute: {match.fixture.status.elapsed}
      </p>

      <p>
        Venue: {match.fixture.venue.name}
      </p>

      <p>
        Referee: {match.fixture.referee}
      </p>

      <p>
        League: {match.league.name}
      </p>

      <MatchStatistics
        fixtureId={match.fixture.id}
      />

      <HeadToHead

        homeTeam={
         match.teams.home.id
        }

        awayTeam={
         match.teams.away.id
        }

      />
    </div>
  );
}

export default MatchDetails;