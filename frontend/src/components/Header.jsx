export default function Header({ productCount }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Marketly home">
        <span className="brand-mark" aria-hidden="true">
          m
        </span>
        <span>marketly<span className="brand-period">.</span></span>
      </a>
      <div className="header-note">
        <span className="header-note-label">THE EVERYDAY EDIT</span>
        <span className="header-note-divider" aria-hidden="true" />
        <span>Good things, thoughtfully found.</span>
      </div>
      <div className="header-inventory" aria-live="polite">
        <span className="inventory-dot" aria-hidden="true" />
        <span>{productCount === null ? "Loading collection" : `${productCount} products`}</span>
      </div>
    </header>
  );
}
