import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { to: "/", icon: "🏠", label: "Home" },
    { to: "/live", icon: "🔴", label: "Live" },
    { to: "/worldcup", icon: "🌍", label: "World Cup" },
    { to: "/standings", icon: "📊", label: "Stats" },
    { to: "/favorites", icon: "⭐", label: "Saved" },
  ];

  return (
    <header className="app-navbar">
      <div className="navbar-brand-row">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo">⚽</span>
          <span>LivePulse</span>
        </NavLink>
      </div>

      <nav className="navbar-menu-row" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              isActive ? "navbar-item active" : "navbar-item"
            }
          >
            <span className="navbar-item-icon">{item.icon}</span>
            <span className="navbar-item-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;