import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../../components/Common/EmptyState";
import { Modal } from "react-bootstrap";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    formatNaira,
    deliveryZones,
    appliedCoupon,
    placeOrder,
    cms,
  } = useStore();
  const { currentUser } = useAuth();

  const [orderType, setOrderType] = useState("delivery"); // delivery or pickup
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || "");
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || "");
  const [city, setCity] = useState("Benin City");
  const [stateName, setStateName] = useState("Edo State");
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Paystack"); // Paystack, Bank Transfer, Cash on Delivery
  const [bankRefInput, setBankRefInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [formError, setFormError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="fa-solid fa-basket-shopping"
          title="Your Cart is Empty"
          description="You need to add some food items to your cart before proceeding to checkout."
          actionText="Browse Menu"
          actionLink="/shop"
        />
      </div>
    );
  }

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = orderType === "pickup" ? 0 : (selectedZone ? selectedZone.fee : 0);
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount || 0 : 0;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleSubmitCheckout = (e) => {
    e.preventDefault();
    setFormError("");

    if (!customerName.trim()) {
      setFormError("Please provide your full name.");
      return;
    }
    if (!customerPhone.trim()) {
      setFormError("Please provide your phone number for delivery contact.");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      setFormError("Please provide your delivery address.");
      return;
    }

    if (paymentMethod === "Paystack") {
      setShowPaystackModal(true);
    } else {
      processOrderSubmission(paymentMethod === "Bank Transfer" ? (bankRefInput || `TRF-${Date.now()}`) : `COD-${Date.now()}`);
    }
  };

  const processOrderSubmission = (paymentRef) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = placeOrder({
        userId: currentUser?.id || "guest",
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || "guest@glozzyfoods.com",
        customerPhone: customerPhone.trim(),
        orderType: orderType,
        deliveryAddress: orderType === "pickup" ? "Pickup at GlozzyFoods Kitchen" : `${deliveryAddress.trim()}, ${city}, ${stateName}`,
        deliveryZone: orderType === "pickup" ? "Store Pickup" : (selectedZone?.name || "Standard Zone"),
        deliveryFee: deliveryFee,
        customerNotes: customerNotes.trim(),
        items: cart,
        paymentMethod: paymentMethod,
        paymentReference: paymentRef,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      });

      setIsProcessing(false);
      setShowPaystackModal(false);
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    }, 1200);
  };

  const bankDetails = cms?.storeContact?.bankDetails || {
    bankName: "Zenith Bank",
    accountNumber: "1018849201",
    accountName: "GLOZZYFOODS ND MORE",
  };

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
              <Link to="/cart" className="text-decoration-none text-muted">Cart</Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>

        <h2 className="fw-bold text-dark mb-4">Complete Your Order</h2>

        {formError && (
          <div className="alert alert-danger rounded-4 py-2 px-3 mb-4 shadow-sm">
            <i className="fa-solid fa-triangle-exclamation me-2"></i>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmitCheckout}>
          <div className="row g-4">
            {/* LEFT COLUMN: CUSTOMER & DELIVERY INFO */}
            <div className="col-lg-7">
              {/* Order Type Toggle */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">1. Order Method</h5>
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                        orderType === "delivery"
                          ? "border-danger bg-danger bg-opacity-10 text-danger fw-bold"
                          : "bg-light text-muted"
                      }`}
                      onClick={() => setOrderType("delivery")}
                    >
                      <i className="fa-solid fa-truck-fast fs-4 d-block mb-1"></i>
                      Doorstep Delivery
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                        orderType === "pickup"
                          ? "border-danger bg-danger bg-opacity-10 text-danger fw-bold"
                          : "bg-light text-muted"
                      }`}
                      onClick={() => setOrderType("pickup")}
                    >
                      <i className="fa-solid fa-store fs-4 d-block mb-1"></i>
                      Store Pickup
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">2. Customer Details</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Osasere Ighodaro"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      className="form-control rounded-3"
                      placeholder="e.g. 08023456789"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Email Address</label>
                    <input
                      type="email"
                      className="form-control rounded-3"
                      placeholder="e.g. osas@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Details (if Delivery selected) */}
              {orderType === "delivery" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <h5 className="fw-bold text-dark mb-3">3. Delivery Destination</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Delivery Zone / Location *</label>
                      <select
                        className="form-select rounded-3"
                        value={selectedZoneId}
                        onChange={(e) => setSelectedZoneId(e.target.value)}
                      >
                        {deliveryZones.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name} — {formatNaira(z.fee)} ({z.estimatedTime})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Street Address & Landmark *</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="2"
                        placeholder="House / Flat No, Street name, closest popular landmark..."
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">City</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">State</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-2">Special Delivery / Food Instructions</h5>
                <p className="text-muted small mb-2">
                  Cake board message, spice level, or special packaging preferences.
                </p>
                <textarea
                  className="form-control rounded-3"
                  rows="2"
                  placeholder="e.g. Please write 'Happy Birthday Mummy' on cake board, extra chili sauce on small chops..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                ></textarea>
              </div>

              {/* Payment Methods */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">4. Choose Payment Method</h5>
                <div className="d-flex flex-column gap-3">
                  {/* Paystack Option */}
                  <label
                    className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                      paymentMethod === "Paystack"
                        ? "border-danger bg-danger bg-opacity-10"
                        : "bg-white"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input mt-0"
                        checked={paymentMethod === "Paystack"}
                        onChange={() => setPaymentMethod("Paystack")}
                      />
                      <div>
                        <strong className="text-dark d-block">Pay with Paystack (Debit Card / USSD / Transfer)</strong>
                        <small className="text-muted">Instant payment verification</small>
                      </div>
                    </div>
                    <span className="badge bg-dark text-warning px-3 py-1">Paystack Secure</span>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    className={`p-3 rounded-3 border d-flex align-items-start justify-content-between cursor-pointer ${
                      paymentMethod === "Bank Transfer"
                        ? "border-danger bg-danger bg-opacity-10"
                        : "bg-white"
                    }`}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input mt-1"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={() => setPaymentMethod("Bank Transfer")}
                      />
                      <div>
                        <strong className="text-dark d-block">Direct Bank Transfer</strong>
                        <small className="text-muted d-block mb-2">
                          Transfer directly to our official company account.
                        </small>

                        {paymentMethod === "Bank Transfer" && (
                          <div className="p-3 bg-white border rounded-3 mt-2 small">
                            <div className="mb-1">
                              <strong>Bank:</strong> {bankDetails.bankName}
                            </div>
                            <div className="mb-1">
                              <strong>Account Number:</strong>{" "}
                              <span className="font-monospace fw-bold text-danger fs-6">{bankDetails.accountNumber}</span>
                            </div>
                            <div className="mb-2">
                              <strong>Account Name:</strong> {bankDetails.accountName}
                            </div>
                            <label className="form-label small fw-bold text-dark">
                              Transaction Reference / Sender Name:
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm rounded-2"
                              placeholder="e.g. Osasere Transfer Ref"
                              value={bankRefInput}
                              onChange={(e) => setBankRefInput(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-danger bg-danger bg-opacity-10"
                        : "bg-white"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input mt-0"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <div>
                        <strong className="text-dark d-block">Cash on Delivery / Pickup</strong>
                        <small className="text-muted">Pay in cash or POS on arrival</small>
                      </div>
                    </div>
                    <span className="badge bg-secondary text-white px-2 py-1">COD</span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
                <h4 className="fw-bold text-dark mb-3">Order Items ({cart.length})</h4>

                {/* Items Mini List */}
                <div className="d-flex flex-column gap-3 mb-4 max-vh-40 overflow-auto">
                  {cart.map((item) => (
                    <div className="d-flex align-items-center justify-content-between gap-2" key={item.id}>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-2 object-fit-cover"
                          style={{ width: "45px", height: "45px" }}
                        />
                        <div>
                          <span className="fw-semibold text-dark small d-block line-clamp-1">{item.name}</span>
                          <span className="text-muted" style={{ fontSize: "11px" }}>
                            {item.quantity}x &bull; {item.variantName}
                          </span>
                        </div>
                      </div>
                      <span className="fw-bold text-dark small">
                        {formatNaira(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-3" />

                {/* Totals */}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-bold text-dark">{formatNaira(cartSubtotal)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    {orderType === "pickup" ? "Pickup Fee:" : "Delivery Fee:"}
                  </span>
                  <span className="fw-bold text-dark">
                    {orderType === "pickup" ? "FREE" : formatNaira(deliveryFee)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Coupon Discount:</span>
                    <span className="fw-bold">-{formatNaira(discountAmount)}</span>
                  </div>
                )}

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-dark">Final Total:</span>
                  <span className="fs-2 fw-bold text-danger">{formatNaira(grandTotal)}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-glozzy-primary btn-lg w-100 py-3 mb-3 shadow-sm"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing Order...
                    </>
                  ) : paymentMethod === "Paystack" ? (
                    <>
                      <i className="fa-solid fa-credit-card me-2"></i> Pay {formatNaira(grandTotal)} with Paystack
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check-circle me-2"></i> Confirm Order ({formatNaira(grandTotal)})
                    </>
                  )}
                </button>

                <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
                  <i className="fa-solid fa-lock text-success"></i>
                  <span>End-to-end encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Paystack Inline Simulation Modal */}
      <Modal show={showPaystackModal} onHide={() => setShowPaystackModal(false)} centered>
        <div className="modal-header border-0 pb-0">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark text-warning px-3 py-2 fw-bold">Paystack Checkout</span>
          </div>
          <button type="button" className="btn-close" onClick={() => setShowPaystackModal(false)}></button>
        </div>
        <div className="modal-body p-4 text-center">
          <div className="mb-3">
            <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center p-3 mb-2">
              <i className="fa-solid fa-receipt fs-3"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">GlozzyFoods ND More</h5>
            <p className="text-muted small mb-0">{customerEmail || "orders@glozzyfoods.com"}</p>
          </div>

          <div className="p-3 bg-light rounded-4 mb-4">
            <span className="text-muted small d-block">Amount Due</span>
            <span className="fs-2 fw-bold text-danger">{formatNaira(grandTotal)}</span>
          </div>

          <p className="small text-muted mb-4">
            Pay safely using your Nigerian Debit Card, Bank USSD code, or Paystack Virtual Account.
          </p>

          <button
            type="button"
            className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm"
            onClick={() => processOrderSubmission(`PSTK_${Date.now()}`)}
            disabled={isProcessing}
          >
            {isProcessing ? "Verifying Transaction..." : `Complete ${formatNaira(grandTotal)} Payment`}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
