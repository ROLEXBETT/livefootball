function EmptyState({
  icon = "ℹ️",
  title = "No data available",
  message = "Please check again later.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;