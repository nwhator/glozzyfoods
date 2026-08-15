import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import EmptyState from "../../components/Common/EmptyState";
import { Modal } from "react-bootstrap";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, formatNaira, addToCart, wishlist, toggleWishlist, reviews, addReview, cms } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [toastMessage, setToastMessage] = useState("");

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="fa-solid fa-triangle-exclamation"
          title="Product Not Found"
          description="The food item you requested does not exist or has been updated."
          actionText="Back to Menu"
          actionLink="/shop"
        />
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : (product.discountPrice || product.price);
  const isOutOfStock = product.trackInventory && product.stock <= 0;

  // Product reviews
  const productReviews = reviews.filter((r) => r.productId === product.id && r.approved);

  // Related products
  const relatedProducts = products
    .filter((p) => p.active && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setToastMessage("Added to your shopping cart!");
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate("/checkout");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview({
      productId: product.id,
      customerName: reviewName.trim(),
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
    });
    setShowReviewModal(false);
    setReviewName("");
    setReviewComment("");
    setToastMessage("Thank you! Your review has been submitted.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";
  const variantDetail = selectedVariant ? ` (${selectedVariant.name}: ${selectedVariant.value})` : "";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello GlozzyFoods, I would like to order: ${product.name}${variantDetail} - Quantity: ${quantity} (Total: ${formatNaira(
      currentPrice * quantity
    )})`
  )}`;

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none text-muted">Menu</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/category/${product.categoryId?.replace("cat-", "")}`} className="text-decoration-none text-muted">
                {product.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-semibold text-truncate" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="alert alert-success alert-dismissible fade show rounded-4 mb-4 shadow-sm" role="alert">
            <i className="fa-solid fa-circle-check me-2"></i>
            {toastMessage}
            <Link to="/cart" className="btn btn-sm btn-outline-success ms-3 fw-bold">
              View Cart &rarr;
            </Link>
          </div>
        )}

        {/* MAIN PRODUCT SECTION */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-white">
          <div className="row g-5">
            {/* Gallery Column */}
            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden border mb-3 position-relative" style={{ maxHeight: "450px" }}>
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: "350px", maxHeight: "450px" }}
                />
                {product.discountPrice && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fs-6">
                    Special Offer
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn p-0 rounded-3 border-2 overflow-hidden ${
                        selectedImage === img ? "border-danger" : "border-transparent"
                      }`}
                      style={{ width: "70px", height: "70px" }}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt="thumb" className="w-100 h-100 object-fit-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="col-lg-6">
              {/* Category & Ratings */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold">
                  {product.categoryName || "Glozzy Delicacy"}
                </span>
                <div className="d-flex align-items-center gap-1 text-warning">
                  <i className="fa-solid fa-star"></i>
                  <span className="text-dark fw-bold small">{product.rating || "5.0"}</span>
                  <span className="text-muted small">({productReviews.length || product.reviewsCount || 10} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="fw-bold text-dark mb-2" style={{ fontSize: "28px" }}>
                {product.name}
              </h1>

              {/* SKU & Stock */}
              <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                <span>SKU: <strong className="text-dark">{product.sku || "GLZ-FD-01"}</strong></span>
                <span>&bull;</span>
                {isOutOfStock ? (
                  <span className="text-danger fw-bold"><i className="fa-solid fa-circle-xmark me-1"></i> Out of Stock</span>
                ) : (
                  <span className="text-success fw-bold"><i className="fa-solid fa-circle-check me-1"></i> Fresh In Stock ({product.stock} left)</span>
                )}
              </div>

              {/* Price Display */}
              <div className="d-flex align-items-baseline gap-3 mb-4 p-3 rounded-3 bg-light">
                <span className="fs-2 fw-bold text-danger">
                  {formatNaira(currentPrice)}
                </span>
                {!selectedVariant && product.discountPrice && (
                  <span className="text-muted text-decoration-line-through fs-5">
                    {formatNaira(product.price)}
                  </span>
                )}
                {product.discountPrice && !selectedVariant && (
                  <span className="badge bg-danger rounded-pill px-2 py-1 small">
                    Save {formatNaira(product.price - product.discountPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-muted mb-4" style={{ lineHeight: "1.6" }}>
                {product.shortDescription || product.description}
              </p>

              {/* Dynamic Variants Picker */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark mb-2">
                    Choose {product.variants[0]?.name || "Size / Portion"}:
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className={`btn ${
                          selectedVariant?.id === v.id
                            ? "btn-danger fw-bold shadow-sm"
                            : "btn-outline-secondary"
                        } rounded-pill px-3 py-2`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        {v.value} — <span className="font-monospace">{formatNaira(v.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Wishlist */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center">
                  <span className="fw-bold small text-dark me-2">Quantity:</span>
                  <div className="input-group" style={{ width: "130px" }}>
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

                {/* Wishlist Button */}
                <button
                  type="button"
                  className={`btn ${isWishlisted ? "btn-danger" : "btn-outline-danger"} rounded-circle p-2 d-flex align-items-center justify-content-center`}
                  style={{ width: "44px", height: "44px" }}
                  onClick={() => toggleWishlist(product)}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <i className={`fa-heart ${isWishlisted ? "fa-solid text-white" : "fa-regular"}`}></i>
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-glozzy-primary flex-grow-1 py-3"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <i className="fa-solid fa-cart-plus me-2"></i>
                    Add to Cart ({formatNaira(currentPrice * quantity)})
                  </button>
                  <button
                    type="button"
                    className="btn btn-glozzy-accent py-3 px-4"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Direct WhatsApp Ordering */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glozzy-whatsapp w-100 py-3"
                >
                  <i className="fa-brands fa-whatsapp fs-5 me-2"></i>
                  Order via WhatsApp (Instant Reply)
                </a>
              </div>

              {/* Highlights Micro-Info */}
              <div className="p-3 rounded-3 bg-light border small text-muted d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-clock text-danger"></i>
                  <span>Prep time: <strong>{product.preparationTime || "25 - 45 Minutes"}</strong></span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-success"></i>
                  <span>100% Homemade, Safe & Hygienic Kitchen Preparation</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-truck text-warning"></i>
                  <span>Fast delivery across all Benin City zones</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: Description, Ingredients, Allergens, Reviews */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-white">
          <ul className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-4 ${activeTab === "desc" ? "active bg-danger" : "text-dark"}`}
                onClick={() => setActiveTab("desc")}
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-4 ${activeTab === "ingredients" ? "active bg-danger" : "text-dark"}`}
                onClick={() => setActiveTab("ingredients")}
              >
                Ingredients & Allergens
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-4 ${activeTab === "reviews" ? "active bg-danger" : "text-dark"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Customer Reviews ({productReviews.length})
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === "desc" && (
              <div>
                <h5 className="fw-bold text-dark mb-3">About this Delicacy</h5>
                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                  {product.description}
                </p>
                <div className="mt-4 p-3 bg-light rounded-3">
                  <h6 className="fw-bold text-dark">Special Instructions for Cakes & Trays:</h6>
                  <p className="small text-muted mb-0">
                    Need custom writing on the cake, specific spice levels, or custom catering packings? You can include your special requests in the checkout notes or chat with us on WhatsApp!
                  </p>
                </div>
              </div>
            )}

            {activeTab === "ingredients" && (
              <div>
                <h5 className="fw-bold text-dark mb-3">Ingredients & Food Safety</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <h6 className="fw-bold text-danger mb-2">
                        <i className="fa-solid fa-leaf me-2"></i> Key Ingredients:
                      </h6>
                      <p className="text-muted small mb-0">
                        {product.ingredients || "Made with fresh natural ingredients, authentic Nigerian seasonings, and premium quality produce."}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <h6 className="fw-bold text-warning text-dark mb-2">
                        <i className="fa-solid fa-triangle-exclamation text-warning me-2"></i> Allergen Information:
                      </h6>
                      <p className="text-muted small mb-0">
                        {product.allergens || "Please notify our team of severe food allergies before ordering."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">Customer Feedback</h5>
                    <small className="text-muted">Real reviews from verified food lovers</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-pill px-3 py-2 small"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <i className="fa-solid fa-pen-to-square me-1"></i> Write a Review
                  </button>
                </div>

                {productReviews.length === 0 ? (
                  <p className="text-muted small py-3">No reviews yet for this product. Be the first to taste and review!</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {productReviews.map((rev) => (
                      <div className="p-3 rounded-3 bg-light border" key={rev.id}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-dark">{rev.customerName}</span>
                          <span className="text-muted small">{rev.date}</span>
                        </div>
                        <div className="text-warning small mb-2">
                          {[...Array(rev.rating)].map((_, i) => (
                            <i className="fa-solid fa-star me-1" key={i}></i>
                          ))}
                        </div>
                        <p className="text-muted small mb-0">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark mb-0">You Might Also Love</h3>
              <Link to="/shop" className="text-danger fw-semibold text-decoration-none small">
                View All &rarr;
              </Link>
            </div>
            <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
              {relatedProducts.map((p) => (
                <div className="col" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark">Review {product.name}</h5>
          <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
        </div>
        <form onSubmit={handleReviewSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label small fw-bold">Your Name</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. Osasere I."
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Rating (Stars)</label>
              <select
                className="form-select rounded-3"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Good)</option>
                <option value="2">⭐⭐ (2 - Fair)</option>
                <option value="1">⭐ (1 - Needs Improvement)</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Your Review & Taste Experience</label>
              <textarea
                className="form-control rounded-3"
                rows="4"
                placeholder="Tell us what you loved about this dish..."
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowReviewModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              Submit Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
