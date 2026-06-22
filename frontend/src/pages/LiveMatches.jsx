import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import MatchCard from "../components/MatchCard";
import Loader from "../components/Loader";
import RefreshButton from "../components/RefreshButton";
import LastUpdated from "../components/LastUpdated";
import EmptyState from "../components/EmptyState";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(fetchMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const [liveRes, worldCupRes] = await Promise.all([
        API.get("/live"),
        API.get("/worldcup/fixtures"),
      ]);

      const liveHasError =
        liveRes.data.errors && Object.keys(liveRes.data.errors).length > 0;

      const worldCupHasError =
        worldCupRes.data.errors &&
        Object.keys(worldCupRes.data.errors).length > 0;

      const liveMatches = liveHasError ? [] : liveRes.data.response || [];
      const worldCupFixtures = worldCupHasError
        ? []
        : worldCupRes.data.response || [];

      const combined = [...liveMatches, ...worldCupFixtures];

      const uniqueMatches = Array.from(
        new Map(combined.map((match) => [match.fixture.id, match])).values()
      );

      setMatches(uniqueMatches);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Live page matches error:", error);
      setMatches([]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const groupedMatches = useMemo(() => {
    const now = new Date();

    const live = [];
    const upcoming = [];
    const finished = [];

    matches.forEach((match) => {
      const status = match.fixture?.status?.short || "";
      const matchDate = new Date(match.fixture?.date);

      if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
        live.push(match);
      } else if (["FT", "AET", "PEN"].includes(status)) {
        finished.push(match);
      } else if (matchDate >= now) {
        upcoming.push(match);
      }
    });

    upcoming.sort(
      (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
    );

    finished.sort(
      (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date)
    );

    return {
      live,
      upcoming: upcoming.slice(0, 12),
      finished: finished.slice(0, 12),
    };
  }, [matches]);

  const visibleMatches = groupedMatches[activeTab] || [];

  const tabLabels = [
    { key: "live", label: "🔴 Live Now", count: groupedMatches.live.length },
    {
      key: "upcoming",
      label: "📅 Upcoming",
      count: groupedMatches.upcoming.length,
    },
    {
      key: "finished",
      label: "✅ Finished",
      count: groupedMatches.finished.length,
    },
  ];

  if (loading && !lastUpdated) return <Loader />;

  return (
    <div className="page">
      <h1>🔴 Live Scores</h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px", lineHeight: 1.6 }}>
        Follow live football scores, upcoming fixtures and recently finished
        matches.
      </p>

      <RefreshButton
        onClick={fetchMatches}
        loading={loading}
        label="Refresh scores"
      />

      <LastUpdated time={lastUpdated} />

      {loading && lastUpdated && (
        <p style={{ color: "#94a3b8", marginBottom: "14px" }}>
          Updating football scores...
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        {tabLabels.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              border: "1px solid rgba(148, 163, 184, 0.25)",
              borderRadius: "999px",
              padding: "10px 14px",
              background:
                activeTab === tab.key
                  ? "rgba(56, 189, 248, 0.22)"
                  : "rgba(30, 41, 59, 0.95)",
              color: activeTab === tab.key ? "#e0f2fe" : "#cbd5e1",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {visibleMatches.length === 0 ? (
        <div>
          <EmptyState
            icon={
              activeTab === "live" ? "🔴" : activeTab === "upcoming" ? "📅" : "✅"
            }
            title={
              activeTab === "live"
                ? "No live matches right now"
                : activeTab === "upcoming"
                ? "No upcoming fixtures found"
                : "No recently finished matches"
            }
            message={
              activeTab === "live"
                ? "Live matches will appear here automatically when games are being played."
                : activeTab === "upcoming"
                ? "Upcoming fixtures will appear here when available."
                : "Recently completed matches will appear here after full-time."
            }
          />

          {activeTab === "upcoming" && (
            <Link
              to="/worldcup"
              style={{
                display: "inline-block",
                marginTop: "16px",
                background: "#2563eb",
                color: "white",
                padding: "12px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              View World Cup Fixtures
            </Link>
          )}
        </div>
      ) : (
        <div>
          {visibleMatches.map((match) => (
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveMatches;