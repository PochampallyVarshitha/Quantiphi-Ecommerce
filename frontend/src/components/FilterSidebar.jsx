import CategoryFilter from "./CategoryFilter.jsx";
import PriceRangeSlider from "./PriceRangeSlider.jsx";
import RatingFilter from "./RatingFilter.jsx";

export default function FilterSidebar({
  categories,
  minPrice,
  maxPrice,
  minRating,
  onCategoriesChange,
  onPriceChange,
  onRatingChange,
  onReset,
  hasActiveFilters,
}) {
  return (
    <aside aria-label="Product filters" className="filter-sidebar">
      <div className="sidebar-heading">
        <div>
          <span className="eyebrow">MAKE IT YOURS</span>
          <h2>Filters</h2>
        </div>
        {hasActiveFilters && (
          <button className="text-button reset-link" onClick={onReset} type="button">
            Reset all
          </button>
        )}
      </div>
      <CategoryFilter onChange={onCategoriesChange} selectedCategories={categories} />
      <div className="filter-divider" />
      <PriceRangeSlider maxPrice={maxPrice} minPrice={minPrice} onChange={onPriceChange} />
      <div className="filter-divider" />
      <RatingFilter minRating={minRating} onChange={onRatingChange} />
      <div className="sidebar-footnote">
        <span className="shield-icon" aria-hidden="true">✓</span>
        <span>Thoughtful finds. Fair prices.</span>
      </div>
    </aside>
  );
}
