import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";

function Stadiums() {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStadiums();
  }, []);

  const loadStadiums = async () => {
    try {
      const res = await API.get("/worldcup/stadiums");
      setStadiums(res.data.stadiums || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏟️ World Cup Stadiums</h1>

      {stadiums.length === 0 ? (
        <p>No stadiums available.</p>
      ) : (
        stadiums.map((stadium) => (
          <div
            key={stadium.name}
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
            }}
          >
            {stadium.image && (
              <img
                src={stadium.image}
                alt={stadium.name}
                width="100%"
                style={{
                  borderRadius: "14px",
                  marginBottom: "16px",
                  objectFit: "cover",
                }}
              />
            )}

            <h2 style={{ margin: "0 0 8px 0" }}>{stadium.name}</h2>
            <p style={{ margin: "0 0 4px 0" }}>{stadium.city}</p>
            <p style={{ margin: 0 }}>Capacity: {stadium.capacity}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Stadiums;
