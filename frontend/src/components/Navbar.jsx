import { Link } from "react-router-dom";

function Navbar() {

  return (
    <nav
      style={{
        background: "#111827",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>⚽ Football Live</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Home</Link>
        <Link to="/standings">Standings</Link>
        <Link to="/topscorers">⚽ Scorers</Link>
        <Link to="/worldcup">🌎 World Cup</Link>
        <Link to="/worldcup/stadiums">🏟️ Stadiums</Link>
        <Link to="/favorites">Favorites</Link>
      </div>
    </nav>
  );
}

export default Navbar;