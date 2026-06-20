import { useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

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

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Contact from "./pages/Contact";

import InsightsGrid from "./pages/InsightsGrid";
import ArticleDetail from "./pages/ArticleDetail";

import WorldCup from "./pages/WorldCup";
import Stadiums from "./pages/Stadiums";
import WorldCupTopScorers from "./pages/WorldCupTopScorers";
import WorldCupSquad from "./pages/WorldCupSquad";
import WorldCupBracket from "./pages/WorldCupBracket";
import WorldCupTeamStats from "./pages/WorldCupTeamStats";
import WorldCupTeams from "./pages/WorldCupTeams";

import { initializeAdMob, showBannerAd } from "./services/admob";

function App() {
  const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  if (!Capacitor.isNativePlatform()) return;

  let listener;

  const setupBackButton = async () => {
    listener = await CapacitorApp.addListener("backButton", () => {
      if (location.pathname !== "/") {
        navigate(-1);
      } else {
        CapacitorApp.exitApp();
      }
    });
  };

  setupBackButton();

  return () => {
    if (listener) {
      listener.remove();
    }
  };
}, [location.pathname, navigate]);

  useEffect(() => {
    const startAds = async () => {
      await initializeAdMob();
      await showBannerAd();
    };

    startAds();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        paddingBottom: "120px",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/live" element={<LiveMatches />} />
          <Route path="/match/:id" element={<MatchDetails />} />

          <Route path="/worldcup" element={<WorldCup />} />
          <Route path="/worldcup/bracket" element={<WorldCupBracket />} />
          <Route path="/worldcup/stadiums" element={<Stadiums />} />
          <Route
            path="/worldcup/topscorers"
            element={<WorldCupTopScorers />}
          />
          <Route path="/worldcup/squads" element={<WorldCupTeams />} />
          <Route path="/worldcup/squad/:teamId" element={<WorldCupSquad />} />
          <Route path="/worldcup/teamstats" element={<WorldCup />} />
          <Route
            path="/worldcup/teamstats/:teamId"
            element={<WorldCupTeamStats />}
          />

          <Route path="/standings" element={<Standings />} />
          <Route path="/topscorers" element={<TopScorers />} />

          <Route path="/search" element={<SearchTeams />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/player/:id" element={<PlayerDetails />} />

          <Route path="/favorites" element={<Favorites />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/insights" element={<InsightsGrid />} />
          <Route path="/insights/:slug" element={<ArticleDetail />} />

          <Route
            path="/WorldCupBracket"
            element={<Navigate to="/worldcup/bracket" replace />}
          />
          <Route path="/WorldCup" element={<Navigate to="/worldcup" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <Link to="/insights">Insights</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}

export default App;