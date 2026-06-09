import { requestNotificationPermission } from "../firebaseMessaging";

function Home() {

  const getToken = async () => {

    const token =
      await requestNotificationPermission();

    console.log(token);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "20px",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
        }}
      >
        <h1>⚽ Football Live</h1>
        <p style={{ marginTop: "12px", color: "#e2e8f0" }}>
          Live scores, standings, teams, player stats and goal alerts.
        </p>
      </div>

      <button
        onClick={getToken}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Get Token
      </button>
    </div>
  );
}

export default Home;