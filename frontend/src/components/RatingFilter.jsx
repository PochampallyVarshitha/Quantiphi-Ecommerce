const RATINGS = [
  { value: "", label: "All ratings" },
  { value: "1", label: "1 star & up" },
  { value: "2", label: "2 stars & up" },
  { value: "3", label: "3 stars & up" },
  { value: "4", label: "4 stars & up" },
  { value: "5", label: "5 stars" },
];

export default function RatingFilter({ minRating, onChange }) {
  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-legend">Customer rating</legend>
      <div className="rating-options">
        {RATINGS.map((rating) => (
          <label className="radio-option" key={rating.value || "all"}>
            <input
              checked={minRating === rating.value}
              name="minimum-rating"
              onChange={() => onChange(rating.value)}
              type="radio"
              value={rating.value}
            />
            <span className="custom-radio" aria-hidden="true" />
            <span className="rating-stars" aria-hidden="true">
              {rating.value ? `${"★".repeat(Number(rating.value))}${"☆".repeat(5 - Number(rating.value))}` : ""}
            </span>
            <span>{rating.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
