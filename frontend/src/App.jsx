import { Routes, Route, Link, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import LiveMatches from "./pages/LiveMatches";
import MatchDetails from "./pages/MatchDetails";
import Standings from "./pages/Standings";
import SearchTeams from "./pages/SearchTeams";
import TeamDetails from "./pages/TeamDetails";
import PlayerDetails from "./pages/PlayerDetails";
import Favorites from "./pages/Favorites";
import TopScorers from "./pages/TopScorers";

import WorldCup from "./pages/WorldCup";
import Stadiums from "./pages/Stadiums";
import WorldCupTopScorers from "./pages/WorldCupTopScorers";
import WorldCupSquad from "./pages/WorldCupSquad";
import WorldCupBracket from "./pages/WorldCupBracket";
import WorldCupTeamStats from "./pages/WorldCupTeamStats";
import WorldCupTeams from "./pages/WorldCupTeams";


function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        paddingBottom: "90px",
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/live" element={<LiveMatches />} />
        <Route path="/match/:id" element={<MatchDetails />} />

        <Route path="/worldcup" element={<WorldCup />} />
        <Route path="/worldcup/bracket" element={<WorldCupBracket />} />
        <Route path="/worldcup/stadiums" element={<Stadiums />} />
        <Route path="/worldcup/topscorers" element={<WorldCupTopScorers />} />

        <Route path="/standings" element={<Standings />} />
        <Route path="/topscorers" element={<TopScorers />} />

        <Route path="/search" element={<SearchTeams />} />
        <Route path="/team/:id" element={<TeamDetails />} />
        <Route path="/player/:id" element={<PlayerDetails />} />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="/worldcup/squads" element={<WorldCupTeams />} />
        <Route path="/worldcup/squad/:teamId" element={<WorldCupSquad />} />

        <Route path="/worldcup/teamstats" element={<WorldCup />} />
        <Route path="/worldcup/teamstats/:teamId" element={<WorldCupTeamStats />} />

        <Route path="/WorldCupBracket" element={<Navigate to="/worldcup/bracket" replace />} />
        <Route path="/WorldCup" element={<Navigate to="/worldcup" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="mobile-bottom-nav">
  <Link to="/" className="bottom-nav-link">
    <span>🏠</span>
    <small>Home</small>
  </Link>

  <Link to="/live" className="bottom-nav-link">
    <span>🔴</span>
    <small>Live</small>
  </Link>

  <Link to="/worldcup" className="bottom-nav-link">
    <span>🌎</span>
    <small>World Cup</small>
  </Link>

  <Link to="/standings" className="bottom-nav-link">
    <span>📊</span>
    <small>Stats</small>
  </Link>

  <Link to="/favorites" className="bottom-nav-link">
    <span>⭐</span>
    <small>Saved</small>
  </Link>
  </div>
    </div>
  );
}

export default App;