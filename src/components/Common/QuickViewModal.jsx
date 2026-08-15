import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const QuickViewModal = ({ show, onHide, product }) => {
  const { formatNaira, addToCart, cms } = useStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
    setAddedToast(false);
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onHide();
    }, 1200);
  };

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";
  const variantText = selectedVariant ? ` (${selectedVariant.name}: ${selectedVariant.value})` : "";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello GlozzyFoods, I would like to order: ${product.name}${variantText} - Qty: ${quantity} for ${formatNaira(
      currentPrice * quantity
    )}`
  )}`;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <div className="modal-header border-0 pb-0">
        <span className="badge bg-danger text-white rounded-pill px-3 py-1 small">
          {product.categoryName || "GlozzyFoods Kitchen"}
        </span>
        <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
      </div>

      <div className="modal-body p-4 pt-2">
        <div className="row g-4">
          {/* Image */}
          <div className="col-md-5">
            <div className="rounded-3 overflow-hidden border">
              <img
                src={product.image}
                alt={product.name}
                className="w-100 h-auto object-fit-cover"
                style={{ maxHeight: "320px" }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="col-md-7">
            <h4 className="fw-bold text-dark mb-2">{product.name}</h4>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-2 mb-3">
              <span className="fs-3 fw-bold text-danger">{formatNaira(currentPrice)}</span>
              {!selectedVariant && product.discountPrice && (
                <span className="text-muted text-decoration-line-through fs-6">
                  {formatNaira(product.price)}
                </span>
              )}
            </div>

            <p className="text-muted small mb-3" style={{ lineHeight: "1.5" }}>
              {product.shortDescription || product.description}
            </p>

            {/* Variants Picker */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-bold small text-dark mb-2">
                  Select {product.variants[0]?.name || "Option"}:
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`btn btn-sm ${
                        selectedVariant?.id === v.id
                          ? "btn-danger fw-bold"
                          : "btn-outline-secondary"
                      } rounded-pill px-3 py-2`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.value} — {formatNaira(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-bold small text-dark">Quantity:</span>
              <div className="input-group" style={{ width: "120px" }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center fw-bold bg-white"
                  readOnly
                  value={quantity}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-glozzy-primary flex-grow-1"
                onClick={handleAddToCart}
              >
                <i className="fa-solid fa-cart-plus me-2"></i>
                {addedToast ? "Added to Cart!" : `Add to Cart (${formatNaira(currentPrice * quantity)})`}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glozzy-whatsapp"
                title="Order directly via WhatsApp"
              >
                <i className="fa-brands fa-whatsapp me-1"></i> WhatsApp
              </a>
            </div>

            <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
              <Link
                to={`/product/${product.slug}`}
                onClick={onHide}
                className="text-danger fw-semibold small text-decoration-none"
              >
                View Full Product Details & Ingredients &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
