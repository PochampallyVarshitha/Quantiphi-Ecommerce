import { useState } from "react";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {!imageFailed ? (
          <img
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={() => setImageFailed(true)}
            src={product.image_url}
          />
        ) : (
          <div className="image-fallback" aria-label="Product image unavailable" role="img">
            <span aria-hidden="true">✳</span>
          </div>
        )}
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-rating" aria-label={`Rated ${product.rating} out of 5 stars`}>
            <span aria-hidden="true">★</span>
            {Number(product.rating).toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}
