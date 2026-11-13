export default function EmptyState({ onReset }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">⌕</div>
      <h3>No items match your criteria.</h3>
      <p>Try adjusting your filters to find what you’re looking for.</p>
      <button className="button-primary" onClick={onReset} type="button">
        Reset filters
      </button>
    </div>
  );
}
