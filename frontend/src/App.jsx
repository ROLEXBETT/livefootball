import { Routes, Route, Link } from "react-router-dom";

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
        <Route path="/search" element={<SearchTeams />} />
        <Route path="/team/:id" element={<TeamDetails />} />
        <Route path="/player/:id" element={<PlayerDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/match/:id" element={<MatchDetails />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/topscorers" element={<TopScorers />} />
        <Route path="/worldcup" element={<WorldCup />} />
        <Route path="/worldcup/stadiums" element={<Stadiums />} />
        <Route path="/worldcup/topscorers" element={<WorldCupTopScorers />} />
        <Route path="/worldcup/squad/:teamId" element={<WorldCupSquad />} />
        <Route path="/worldcup/bracket" element={<WorldCupBracket />} />
        <Route path="/worldcup/teamstats/:teamId" element={<WorldCupTeamStats />} />
      </Routes>

      <div
        className="mobile-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#111827",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px",
          zIndex: 20,
        }}
      >
        <Link to="/">🏠</Link>
        <Link to="/standings">📊</Link>
        <Link to="/favorites">⭐</Link>
      </div>
    </div>
  );
}

export default App;