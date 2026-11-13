const CATEGORIES = ["Electronics", "Apparel", "Footwear", "Home & Kitchen", "Accessories"];

export default function CategoryFilter({ selectedCategories, onChange }) {
  function toggleCategory(category) {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    onChange(updated);
  }

  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-legend">Category</legend>
      <div className="category-options">
        {CATEGORIES.map((category) => (
          <label className="checkbox-option" key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <span className="custom-checkbox" aria-hidden="true" />
            <span>{category}</span>
          </label>
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <button className="text-button clear-categories" onClick={() => onChange([])} type="button">
          Clear categories
        </button>
      )}
    </fieldset>
  );
}
