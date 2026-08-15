import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import EmptyState from "../../components/Common/EmptyState";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    formatNaira,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryZones,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || "");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const result = applyCoupon(couponCodeInput);
    setCouponMessage(result);
    if (result.success) {
      setCouponCodeInput("");
    }
  };

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const estimatedDeliveryFee = selectedZone ? selectedZone.fee : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount || 0 : 0;
  const estimatedGrandTotal = Math.max(0, cartSubtotal + estimatedDeliveryFee - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="fa-solid fa-basket-shopping"
          title="Your Cart is Looking a Little Empty"
          description="Let's fix that with something delicious from our African kitchen and confectionery bakery."
          actionText="Explore Full Menu"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none text-muted">Menu</Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
              Shopping Cart
            </li>
          </ol>
        </nav>

        <h2 className="fw-bold text-dark mb-4">Your Shopping Cart ({cart.length} items)</h2>

        <div className="row g-4">
          {/* CART ITEMS TABLE */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ minWidth: "220px" }}>Item & Delicacy</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Subtotal</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded-3 object-fit-cover"
                              style={{ width: "64px", height: "64px" }}
                            />
                            <div>
                              <Link
                                to={`/product/${item.productSlug}`}
                                className="fw-bold text-dark text-decoration-none hover-text-danger d-block"
                                style={{ fontSize: "15px" }}
                              >
                                {item.name}
                              </Link>
                              <span className="badge bg-light text-muted border small">
                                {item.variantName}
                              </span>
                              {item.specialNote && (
                                <small className="text-muted d-block mt-1">
                                  <em>Note: {item.specialNote}</em>
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center fw-semibold text-dark">
                          {formatNaira(item.price)}
                        </td>
                        <td className="text-center">
                          <div className="input-group input-group-sm d-inline-flex" style={{ width: "110px" }}>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control text-center fw-bold bg-white"
                              readOnly
                              value={item.quantity}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-danger">
                          {formatNaira(item.price * item.quantity)}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-light text-danger btn-sm rounded-circle"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-2">
                <Link to="/shop" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                  <i className="fa-solid fa-arrow-left me-1"></i> Continue Shopping
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                  onClick={clearCart}
                >
                  <i className="fa-solid fa-trash me-1"></i> Clear Cart
                </button>
              </div>
            </div>

            {/* COUPON & PROMO CODE BOX */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-ticket text-danger me-2"></i> Have a Discount Coupon?
              </h5>
              <form onSubmit={handleApplyCoupon} className="d-flex gap-2 mb-2" style={{ maxWidth: "450px" }}>
                <input
                  type="text"
                  className="form-control text-uppercase rounded-pill ps-3"
                  placeholder="e.g. GLOZZY10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                />
                <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
                  Apply
                </button>
              </form>

              {couponMessage && (
                <div
                  className={`alert ${couponMessage.success ? "alert-success" : "alert-danger"} py-2 px-3 small rounded-3 mt-2 mb-0`}
                >
                  {couponMessage.message}
                </div>
              )}

              {appliedCoupon && (
                <div className="d-flex align-items-center justify-content-between p-2 mt-2 bg-success bg-opacity-10 text-success rounded-3 small">
                  <div>
                    <i className="fa-solid fa-check-circle me-1"></i>
                    Coupon <strong>{appliedCoupon.code}</strong> active (-{formatNaira(discountAmount)})
                  </div>
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 text-decoration-none small fw-bold"
                    onClick={removeCoupon}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
              <h4 className="fw-bold text-dark mb-4">Order Summary</h4>

              {/* Delivery Zone Estimator */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark mb-1">Estimate Delivery Zone</label>
                <select
                  className="form-select form-select-sm rounded-3"
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                >
                  {deliveryZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({formatNaira(zone.fee)})
                    </option>
                  ))}
                </select>
                <small className="text-muted d-block mt-1">
                  Estimated arrival: <strong>{selectedZone?.estimatedTime || "30 - 45 mins"}</strong>
                </small>
              </div>

              {/* Price Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-bold text-dark">{formatNaira(cartSubtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Estimated Delivery:</span>
                <span className="fw-bold text-dark">{formatNaira(estimatedDeliveryFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Coupon Discount:</span>
                  <span className="fw-bold">-{formatNaira(discountAmount)}</span>
                </div>
              )}

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold text-dark">Estimated Total:</span>
                <span className="fs-3 fw-bold text-danger">{formatNaira(estimatedGrandTotal)}</span>
              </div>

              <button
                type="button"
                className="btn btn-glozzy-primary btn-lg w-100 py-3 mb-3 shadow-sm"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout <i className="fa-solid fa-arrow-right ms-2"></i>
              </button>

              <div className="p-3 bg-light rounded-3 text-center small text-muted">
                <i className="fa-solid fa-lock text-success me-1"></i> Secure checkout with Paystack, Bank Transfer, or Cash on Delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
