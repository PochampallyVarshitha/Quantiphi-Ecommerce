const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getProducts(signal) {
  return fetchProducts("/api/products", signal);
}

export async function getFilteredProducts(filters, signal) {
  const params = new URLSearchParams();

  if (filters.categories.length) {
    params.set("categories", filters.categories.join(","));
  }
  params.set("min_price", String(filters.minPrice));
  params.set("max_price", String(filters.maxPrice));
  if (filters.minRating) {
    params.set("min_rating", String(filters.minRating));
  }
  params.set("sort_by", filters.sortBy);

  return fetchProducts(`/api/products/filter?${params.toString()}`, signal);
}

async function fetchProducts(path, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) {
    let message = `Unable to load products (HTTP ${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch (error) {
      if (error.name !== "SyntaxError") {
        throw error;
      }
    }
    throw new Error(message);
  }
  return response.json();
}
