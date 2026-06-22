function LastUpdated({ time }) {
  if (!time) return null;

  return (
    <p className="last-updated">
      Last updated: {time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  );
}

export default LastUpdated;