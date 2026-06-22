import { Link } from "react-router-dom";

function MatchCard({ match }) {
  const status = match.fixture?.status?.short || "NS";
  const statusLong = match.fixture?.status?.long || "Scheduled";
  const elapsed = match.fixture?.status?.elapsed;

  const isLive = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status);
  const isFinished = ["FT", "AET", "PEN"].includes(status);

  const badgeText = isLive ? "LIVE" : isFinished ? "FT" : status;

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
    color: "white",
    background: isLive ? "#dc2626" : isFinished ? "#16a34a" : "#334155",
  };

  const homeGoals = match.goals?.home ?? "-";
  const awayGoals = match.goals?.away ?? "-";

  return (
    <Link
      to={`/match/${match.fixture.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "15px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
          border: "1px solid #263449",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span style={badgeStyle}>{badgeText}</span>

          <span style={{ color: "#94a3b8", fontSize: "13px" }}>
            {isLive && elapsed ? `${elapsed}'` : statusLong}
          </span>
        </div>

        <TeamRow team={match.teams.home} goals={homeGoals} />

        <div
          style={{
            height: "1px",
            background: "rgba(148, 163, 184, 0.15)",
            margin: "10px 0",
          }}
        />

        <TeamRow team={match.teams.away} goals={awayGoals} />

        <p
          style={{
            margin: "14px 0 0 0",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          {new Date(match.fixture.date).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Link>
  );
}

function TeamRow({ team, goals }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: 0,
        }}
      >
        {team.logo ? (
          <img
            src={team.logo}
            alt={team.name}
            style={{
              width: "34px",
              height: "34px",
              objectFit: "contain",
              background: "white",
              borderRadius: "50%",
              padding: "4px",
              flexShrink: 0,
            }}
          />
        ) : (
          <span
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "#0f172a",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              flexShrink: 0,
            }}
          >
            ?
          </span>
        )}

        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 800,
            color: "#e2e8f0",
          }}
        >
          {team.name}
        </span>
      </span>

      <strong
        style={{
          fontSize: "24px",
          color: "white",
          flexShrink: 0,
        }}
      >
        {goals}
      </strong>
    </div>
  );
}

export default MatchCard;