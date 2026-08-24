import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const ProductCard = ({ product, onQuickView }) => {
  const { formatNaira, addToCart, wishlist, toggleWishlist, cms } = useStore();

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const hasVariants = product.variants && product.variants.length > 0;
  const isOutOfStock = product.trackInventory && product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (hasVariants) {
      if (onQuickView) onQuickView(product);
    } else {
      addToCart(product, null, 1);
    }
  };

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";
  const directWhatsAppUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello GlozzyFoods, I would like to order: ${product.name} (${formatNaira(product.discountPrice || product.price)})`
  )}`;

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="glozzy-food-card">
      {/* Card Image Wrap */}
      <div className="glozzy-card-img-wrap">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="glozzy-card-badges">
          {product.categoryName && (
            <span className="badge-glozzy-category">{product.categoryName}</span>
          )}
          {discountPercentage && (
            <span className="badge-glozzy-discount">-{discountPercentage}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="glozzy-card-quick-actions">
          <button
            type="button"
            className="glozzy-action-circle"
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            onClick={() => toggleWishlist(product)}
            aria-label="Wishlist"
          >
            <i className={`fa-heart ${isWishlisted ? "fa-solid text-danger" : "fa-regular"}`}></i>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="glozzy-card-body">
        {/* Rating and Delivery Prep Time Indicator */}
        <div className="d-flex align-items-center justify-content-between mb-1 text-muted" style={{ fontSize: "12px" }}>
          <div className="d-flex align-items-center gap-1">
            <i className="fa-solid fa-star text-warning"></i>
            <span className="text-dark fw-bold">{product.rating || "5.0"}</span>
            <span>({product.reviewsCount || 12})</span>
          </div>
          <div>
            <span className="badge bg-light text-dark border rounded-pill px-2 py-1">
              <i className="fa-regular fa-clock me-1 text-danger"></i>
              {product.preparationTime?.split("(")[0] || "25 - 35 mins"}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h4 className="glozzy-card-title">
          <Link to={`/product/${product.slug}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h4>

        {/* Short Description */}
        <p className="glozzy-card-desc">
          {product.shortDescription || product.description}
        </p>

        {/* Footer: Price & Chowdeck Style Order Controls */}
        <div className="glozzy-card-footer">
          <div>
            <span className="glozzy-price">
              {formatNaira(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="glozzy-old-price">{formatNaira(product.price)}</span>
            )}
          </div>

          <div className="d-flex align-items-center gap-1">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center p-0"
              style={{ width: "36px", height: "36px" }}
              title="Quick Order via WhatsApp"
              aria-label="Order via WhatsApp"
            >
              <i className="fa-brands fa-whatsapp fs-6"></i>
            </a>

            <button
              type="button"
              className="btn btn-glozzy-primary btn-sm py-2 px-3"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <i className="fa-solid fa-plus me-1"></i>
              {hasVariants ? "Options" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
