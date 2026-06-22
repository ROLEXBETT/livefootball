function RefreshButton({ onClick, loading = false, label = "Refresh" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="refresh-button"
    >
      {loading ? "Refreshing..." : `🔄 ${label}`}
    </button>
  );
}

export default RefreshButton;