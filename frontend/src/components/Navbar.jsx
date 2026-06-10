import { NavLink } from "react-router-dom";

function Navbar() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#38bdf8" : "#ffffff",
    textDecoration: "none",
    fontWeight: isActive ? "800" : "600",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    minWidth: "80px",
    fontSize: "16px",
  });

  return (
    <nav
      style={{
        background: "#111827",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid #1f2937",
      }}
    >
      <NavLink
        to="/"
        style={{
          color: "#ffffff",
          textDecoration: "none",
          fontSize: "26px",
          fontWeight: "900",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "170px",
        }}
      >
        <span>⚽</span>
        <span>Football Live</span>
      </NavLink>

      <NavLink to="/" style={linkStyle}>
        <span>🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink to="/live" style={linkStyle}>
        <span>🔴</span>
        <span>Live</span>
      </NavLink>

      <NavLink to="/standings" style={linkStyle}>
        <span>📊</span>
        <span>Standings</span>
      </NavLink>

      <NavLink to="/topscorers" style={linkStyle}>
        <span>⚽</span>
        <span>Scorers</span>
      </NavLink>

      <NavLink to="/worldcup" style={linkStyle}>
        <span>🌎</span>
        <span>World Cup</span>
      </NavLink>

      <NavLink to="/worldcup/bracket" style={linkStyle}>
        <span>🏆</span>
        <span>Bracket</span>
      </NavLink>

      <NavLink to="/worldcup/squads" style={linkStyle}>
        <span>👥</span>
        <span>Squads</span>
      </NavLink>

      <NavLink to="/worldcup/stadiums" style={linkStyle}>
        <span>🏟️</span>
        <span>Stadiums</span>
      </NavLink>

      <NavLink to="/favorites" style={linkStyle}>
        <span>⭐</span>
        <span>Favorites</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;