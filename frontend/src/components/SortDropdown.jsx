const SORT_OPTIONS = [
  { value: "default", label: "Recommended" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "rating_desc", label: "Top rated first" },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="sort-control">
      <span>Sort by</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="select-chevron" aria-hidden="true">⌄</span>
    </label>
  );
}
