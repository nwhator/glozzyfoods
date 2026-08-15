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
          {product.featured && (
            <span className="badge-glozzy-featured">Popular</span>
          )}
        </div>

        {/* Quick Action Circle Buttons */}
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
          <button
            type="button"
            className="glozzy-action-circle"
            title="Quick View"
            onClick={() => onQuickView && onQuickView(product)}
            aria-label="Quick View"
          >
            <i className="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="glozzy-card-body">
        {/* Rating and Stock Indicator */}
        <div className="d-flex align-items-center justify-content-between mb-1">
          <div className="d-flex align-items-center gap-1 text-warning small">
            <i className="fa-solid fa-star"></i>
            <span className="text-dark fw-bold" style={{ fontSize: "12px" }}>
              {product.rating || "5.0"}
            </span>
            <span className="text-muted" style={{ fontSize: "11px" }}>
              ({product.reviewsCount || 10})
            </span>
          </div>
          <div>
            {isOutOfStock ? (
              <span className="badge bg-secondary text-white" style={{ fontSize: "10px" }}>Out of Stock</span>
            ) : (
              <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: "10px" }}>Fresh In Stock</span>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="glozzy-card-title">
          <Link to={`/product/${product.slug}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="glozzy-card-desc">
          {product.shortDescription || product.description}
        </p>

        {/* Footer: Price & Add to Cart */}
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
              <i className="fa-solid fa-cart-plus me-1"></i>
              {hasVariants ? "Options" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
