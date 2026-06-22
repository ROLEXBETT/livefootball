import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import MatchStatistics from "../components/MatchStatistics";
import HeadToHead from "../components/HeadToHead";
import RefreshButton from "../components/RefreshButton";
import LastUpdated from "../components/LastUpdated";
import EmptyState from "../components/EmptyState";

function MatchDetails() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/match/${id}`);

      const hasApiError =
        res.data.errors && Object.keys(res.data.errors).length > 0;

      if (hasApiError) {
        setMatch(null);
        setLastUpdated(new Date());
        return;
      }

      setMatch(res.data.response?.[0] || null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Match details error:", error);
      setMatch(null);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  if (loading && !lastUpdated) return <Loader />;

  if (!match) {
    return (
      <div className="page">
        <h1>Match Details</h1>

        <RefreshButton
          onClick={fetchMatch}
          loading={loading}
          label="Try again"
        />

        <LastUpdated time={lastUpdated} />

        <EmptyState
          icon="⚽"
          title="Match details unavailable"
          message="This match could not be loaded right now. Please refresh or check again later."
        />
      </div>
    );
  }

  const status = match.fixture?.status?.short || "NS";
  const statusLong = match.fixture?.status?.long || "Scheduled";
  const elapsed = match.fixture?.status?.elapsed;

  const isLive = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status);
  const isFinished = ["FT", "AET", "PEN"].includes(status);

  const badgeText = isLive ? "LIVE" : isFinished ? "FT" : status;

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
    color: "white",
    background: isLive ? "#dc2626" : isFinished ? "#16a34a" : "#334155",
  };

  const homeGoals = match.goals?.home ?? "-";
  const awayGoals = match.goals?.away ?? "-";

  return (
    <div className="page">
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          border: "1px solid #263449",
          borderRadius: "24px",
          padding: "22px",
          marginBottom: "24px",
          boxShadow: "0 16px 35px rgba(0,0,0,0.32)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <span style={badgeStyle}>{badgeText}</span>

          <span style={{ color: "#94a3b8", fontSize: "14px" }}>
            {isLive && elapsed ? `${elapsed}'` : statusLong}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <TeamBlock team={match.teams.home} />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(34px, 10vw, 54px)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1,
              }}
            >
              {homeGoals} - {awayGoals}
            </div>

            <div
              style={{
                color: "#38bdf8",
                fontWeight: 800,
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              {match.league?.name || "Football Match"}
            </div>
          </div>

          <TeamBlock team={match.teams.away} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <InfoItem
            label="Date"
            value={new Date(match.fixture.date).toLocaleString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />

          <InfoItem
            label="Venue"
            value={match.fixture?.venue?.name || "Not available"}
          />

          <InfoItem
            label="Referee"
            value={match.fixture?.referee || "Not available"}
          />

          <InfoItem
            label="Status"
            value={statusLong || "Not available"}
          />
        </div>
      </div>

      <RefreshButton
        onClick={fetchMatch}
        loading={loading}
        label="Refresh match"
      />

      <LastUpdated time={lastUpdated} />

      {loading && lastUpdated && (
        <p style={{ color: "#94a3b8", marginBottom: "14px" }}>
          Updating match details...
        </p>
      )}

      <div style={sectionCardStyle}>
        <h2 style={{ marginTop: 0 }}>📊 Match Statistics</h2>

        <MatchStatistics fixtureId={match.fixture.id} />
      </div>

      <div style={sectionCardStyle}>
        <h2 style={{ marginTop: 0 }}>🤝 Head To Head</h2>

        <HeadToHead
          homeTeam={match.teams.home.id}
          awayTeam={match.teams.away.id}
        />
      </div>
    </div>
  );
}

function TeamBlock({ team }) {
  return (
    <div
      style={{
        textAlign: "center",
        minWidth: 0,
      }}
    >
      {team.logo ? (
        <img
          src={team.logo}
          alt={team.name}
          style={{
            width: "clamp(48px, 14vw, 72px)",
            height: "clamp(48px, 14vw, 72px)",
            objectFit: "contain",
            background: "white",
            borderRadius: "50%",
            padding: "7px",
            marginBottom: "10px",
          }}
        />
      ) : (
        <div
          style={{
            width: "clamp(48px, 14vw, 72px)",
            height: "clamp(48px, 14vw, 72px)",
            borderRadius: "50%",
            background: "#0f172a",
            color: "#94a3b8",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          ?
        </div>
      )}

      <h2
        style={{
          margin: 0,
          fontSize: "clamp(15px, 4vw, 20px)",
          lineHeight: 1.25,
          color: "white",
          overflowWrap: "anywhere",
        }}
      >
        {team.name}
      </h2>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        borderRadius: "14px",
        padding: "14px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          margin: "0 0 6px 0",
          fontSize: "13px",
          fontWeight: 800,
        }}
      >
        {label}
      </p>

      <p
        style={{
          color: "#e2e8f0",
          margin: 0,
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
    </div>
  );
}

const sectionCardStyle = {
  background: "#1e293b",
  border: "1px solid #263449",
  borderRadius: "18px",
  padding: "20px",
  marginBottom: "22px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.24)",
};

export default MatchDetails;