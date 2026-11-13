import { useEffect, useMemo, useRef, useState } from "react";

import EmptyState from "./components/EmptyState.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx";
import Header from "./components/Header.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import SortDropdown from "./components/SortDropdown.jsx";
import { getFilteredProducts } from "./services/productService.js";

const INITIAL_MIN_PRICE = 0;
const INITIAL_MAX_PRICE = 100000;
const PRICE_DEBOUNCE_MS = 250;

export default function App() {
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(INITIAL_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(INITIAL_MAX_PRICE);
  const [settledPrice, setSettledPrice] = useState({
    minPrice: INITIAL_MIN_PRICE,
    maxPrice: INITIAL_MAX_PRICE,
  });
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState([]);
  const [inventoryCount, setInventoryCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSettledPrice((current) =>
        current.minPrice === minPrice && current.maxPrice === maxPrice
          ? current
          : { minPrice, maxPrice },
      );
    }, PRICE_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [minPrice, maxPrice]);

  const filters = useMemo(
    () => ({
      categories,
      minPrice: settledPrice.minPrice,
      maxPrice: settledPrice.maxPrice,
      minRating,
      sortBy,
    }),
    [categories, settledPrice, minRating, sortBy],
  );

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError("");

    getFilteredProducts(filters, controller.signal)
      .then((result) => {
        if (currentRequestId !== requestId.current) return;
        setProducts(result);
        setInventoryCount((count) => (count === null ? result.length : count));
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError" || currentRequestId !== requestId.current) return;
        setError(requestError.message || "Something went wrong while loading products.");
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setLoading(false);
      });

    return () => controller.abort();
  }, [filters]);

  const hasActiveFilters =
    categories.length > 0 ||
    minPrice !== INITIAL_MIN_PRICE ||
    maxPrice !== INITIAL_MAX_PRICE ||
    minRating !== "" ||
    sortBy !== "default";

  function resetFilters() {
    setCategories([]);
    setMinPrice(INITIAL_MIN_PRICE);
    setMaxPrice(INITIAL_MAX_PRICE);
    setSettledPrice({ minPrice: INITIAL_MIN_PRICE, maxPrice: INITIAL_MAX_PRICE });
    setMinRating("");
    setSortBy("default");
  }

  function retryRequest() {
    setError("");
    setSortBy((current) => current);
    setSettledPrice((current) => ({ ...current }));
  }

  return (
    <div className="app-shell">
      <Header productCount={inventoryCount} />
      <main className="page-content">
        <section className="page-intro">
          <div>
            <span className="eyebrow">CURATED FOR EVERY DAY</span>
            <h1>Find your next <span>favourite.</span></h1>
            <p>Good design, useful details, and little things that make life better.</p>
          </div>
          <div className="intro-stamp" aria-hidden="true">
            <span>THE</span>
            <strong>GOOD</strong>
            <span>STUFF</span>
          </div>
        </section>

        <div className="shop-layout">
          <FilterSidebar
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            maxPrice={maxPrice}
            minPrice={minPrice}
            minRating={minRating}
            onCategoriesChange={setCategories}
            onPriceChange={(nextMin, nextMax) => {
              setMinPrice(Math.min(nextMin, nextMax));
              setMaxPrice(Math.max(nextMin, nextMax));
            }}
            onRatingChange={setMinRating}
            onReset={resetFilters}
          />

          <section aria-label="Product inventory" className="inventory-section">
            <div className="inventory-toolbar">
              <div>
                <h2>All the good stuff</h2>
                <p aria-live="polite">
                  {loading ? "Finding your picks…" : `${products.length} ${products.length === 1 ? "item" : "items"} to explore`}
                </p>
              </div>
              <SortDropdown onChange={setSortBy} value={sortBy} />
            </div>

            {error ? (
              <div className="error-state" role="alert">
                <span className="error-mark" aria-hidden="true">!</span>
                <h3>We couldn’t load the collection.</h3>
                <p>{error} Check that the product API is running, then try again.</p>
                <button className="button-primary" onClick={retryRequest} type="button">Try again</button>
              </div>
            ) : loading ? (
              <div className="loading-state" aria-label="Loading products" role="status">
                <span className="loading-spinner" />
                <span>Finding your next favourite…</span>
              </div>
            ) : products.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <ProductGrid products={products} />
            )}
          </section>
        </div>
      </main>
      <footer className="site-footer">
        <span>marketly<span className="brand-period">.</span></span>
        <span>A little more thoughtful, every day.</span>
      </footer>
    </div>
  );
}
