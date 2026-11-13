const MAX_PRICE = 100000;

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceRangeSlider({ minPrice, maxPrice, onChange }) {
  const minimumPosition = (minPrice / MAX_PRICE) * 100;
  const maximumPosition = (maxPrice / MAX_PRICE) * 100;

  return (
    <fieldset className="filter-fieldset">
      <legend className="filter-legend">Price range</legend>
      <div className="price-labels" aria-live="polite">
        <span>{formatPrice(minPrice)}</span>
        <span>{formatPrice(maxPrice)}</span>
      </div>
      <div
        className="range-track"
        style={{
          "--range-start": `${minimumPosition}%`,
          "--range-end": `${maximumPosition}%`,
        }}
      >
        <input
          aria-label="Minimum price"
          className="range-input range-input-min"
          max={maxPrice}
          min="0"
          onChange={(event) => onChange(Number(event.target.value), maxPrice)}
          step="500"
          type="range"
          value={minPrice}
        />
        <input
          aria-label="Maximum price"
          className="range-input range-input-max"
          max={MAX_PRICE}
          min={minPrice}
          onChange={(event) => onChange(minPrice, Number(event.target.value))}
          step="500"
          type="range"
          value={maxPrice}
        />
      </div>
      <div className="range-endpoints">
        <span>₹0</span>
        <span>₹1,00,000</span>
      </div>
    </fieldset>
  );
}
