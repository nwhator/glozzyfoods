import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const STATUS_STEPS = [
  { id: "Pending", label: "Order Received", icon: "fa-solid fa-receipt" },
  { id: "Confirmed", label: "Confirmed", icon: "fa-solid fa-check" },
  { id: "Preparing", label: "In the Kitchen", icon: "fa-solid fa-kitchen-set" },
  { id: "Ready", label: "Packaged & Ready", icon: "fa-solid fa-box" },
  { id: "Out for Delivery", label: "With Rider", icon: "fa-solid fa-motorcycle" },
  { id: "Delivered", label: "Delivered", icon: "fa-solid fa-house-circle-check" },
];

const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const { orders, formatNaira, cms } = useStore();

  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(
        (o) =>
          o.orderNumber?.toLowerCase() === initialOrderId.trim().toLowerCase() ||
          o.id === initialOrderId.trim()
      );
      if (found) {
        setActiveOrder(found);
        setSearchError("");
      } else {
        setSearchError("No order found matching reference: " + initialOrderId);
      }
    } else if (orders.length > 0) {
      setActiveOrder(orders[0]); // default to latest order
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    if (!searchInput.trim()) return;

    const found = orders.find(
      (o) =>
        o.orderNumber?.toLowerCase() === searchInput.trim().toLowerCase() ||
        o.id === searchInput.trim()
    );

    if (found) {
      setActiveOrder(found);
      searchParams.set("orderId", found.orderNumber);
      setSearchParams(searchParams);
    } else {
      setSearchError("No order found with number: " + searchInput.trim());
    }
  };

  const getStepStatus = (stepId, currentStatus) => {
    const orderStatusIndex = STATUS_STEPS.findIndex((s) => s.id === currentStatus);
    const thisStepIndex = STATUS_STEPS.findIndex((s) => s.id === stepId);

    if (currentStatus === "Cancelled") {
      return "cancelled";
    }
    if (thisStepIndex < orderStatusIndex) return "completed";
    if (thisStepIndex === orderStatusIndex) return "current";
    return "upcoming";
  };

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "880px" }}>
        {/* Page Header */}
        <div className="text-center mb-4">
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            Live Dispatch Tracking
          </span>
          <h1 className="fw-bold text-white mb-2">Track Your GlozzyFoods Order</h1>
          <p className="text-muted small">
            Enter your order number (e.g. <strong className="text-white">GF-849201</strong>) to view real-time preparation and delivery updates.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="card border-0 shadow-sm rounded-4 p-3 bg-card mb-4">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control rounded-pill ps-3"
              placeholder="Enter Order Number e.g. GF-849201"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              <i className="fa-solid fa-magnifying-glass me-1"></i> Track
            </button>
          </form>
        </div>

        {searchError && (
          <div className="alert alert-danger rounded-4 py-2 px-3 mb-4 shadow-sm">
            <i className="fa-solid fa-triangle-exclamation me-2"></i> {searchError}
          </div>
        )}

        {/* Order Details & Timeline Display */}
        {activeOrder && (
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-card mb-4">
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom pb-3 mb-4">
              <div>
                <span className="text-muted small d-block">Order Number</span>
                <h4 className="fw-bold text-danger mb-0 font-monospace">{activeOrder.orderNumber}</h4>
              </div>
              <div className="text-md-end">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                  Status: {activeOrder.orderStatus}
                </span>
                <div className="text-muted small mt-1">
                  Placed: {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* VISUAL TIMELINE */}
            {activeOrder.orderStatus === "Cancelled" ? (
              <div className="alert alert-danger text-center rounded-4 py-4 mb-4">
                <i className="fa-solid fa-ban fs-3 d-block mb-2 text-danger"></i>
                <h5 className="fw-bold mb-1 text-white">This order has been cancelled</h5>
                <small className="text-muted">Please contact our support team on WhatsApp for any refund or enquiry.</small>
              </div>
            ) : (
              <div className="my-4 py-2">
                <div className="glozzy-timeline">
                  {STATUS_STEPS.map((step) => {
                    const statusClass = getStepStatus(step.id, activeOrder.orderStatus);
                    return (
                      <div className={`glozzy-timeline-step ${statusClass}`} key={step.id}>
                        <div className="glozzy-step-icon">
                          <i className={step.icon}></i>
                        </div>
                        <div className="glozzy-step-title">{step.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Internal / Dispatch Message */}
            <div className="p-3 rounded-4 bg-elevated border mb-4">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="fa-solid fa-circle-info text-danger"></i>
                <strong className="text-white small">Kitchen & Dispatch Update:</strong>
              </div>
              <p className="text-muted small mb-0">
                {activeOrder.internalNotes || "Your order has been logged and is progressing according to schedule."}
              </p>
            </div>

            {/* Recipient & Items Summary */}
            <div className="row g-4 mb-4 small">
              <div className="col-md-6">
                <div className="p-3 bg-elevated rounded-4 border h-100">
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-location-dot text-danger"></i> Delivery Information
                  </h6>
                  <div className="text-muted mb-1"><strong className="text-white">Customer:</strong> {activeOrder.customerName}</div>
                  <div className="text-muted mb-1"><strong className="text-white">Phone:</strong> {activeOrder.customerPhone}</div>
                  <div className="text-muted mb-1"><strong className="text-white">Zone:</strong> {activeOrder.deliveryZone}</div>
                  <div className="text-muted"><strong className="text-white">Address:</strong> {activeOrder.deliveryAddress}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-elevated rounded-4 border h-100">
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-wallet text-danger"></i> Payment & Summary
                  </h6>
                  <div className="text-muted mb-1"><strong className="text-white">Payment Method:</strong> {activeOrder.paymentMethod}</div>
                  <div className="text-muted mb-1"><strong className="text-white">Payment Status:</strong> <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">{activeOrder.paymentStatus}</span></div>
                  <div className="text-muted mb-1"><strong className="text-white">Reference:</strong> <span className="font-monospace text-danger">{activeOrder.paymentReference}</span></div>
                  <div className="mt-2 pt-2 border-top"><strong className="text-white">Total Amount:</strong> <span className="fw-bold text-danger fs-6 ms-1">{formatNaira(activeOrder.total)}</span></div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <h6 className="fw-bold text-white mb-3">Dishes in this Order ({activeOrder.items?.length || 0})</h6>
            <div className="d-flex flex-column gap-2 mb-4">
              {activeOrder.items?.map((item, idx) => (
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 border bg-elevated" key={idx}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="rounded-3 object-fit-cover border"
                      style={{ width: "42px", height: "42px" }}
                    />
                    <div>
                      <strong className="text-white small d-block">{item.productName}</strong>
                      <small className="text-muted">{item.variantName} &bull; Qty: {item.quantity}</small>
                    </div>
                  </div>
                  <span className="fw-bold text-white small">{formatNaira(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello GlozzyFoods, I am tracking my order ${activeOrder.orderNumber}. Could you provide a quick update?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glozzy-whatsapp rounded-pill px-4"
              >
                <i className="fa-brands fa-whatsapp me-2"></i> Contact Dispatch on WhatsApp
              </a>
              <Link to="/shop" className="btn btn-outline-secondary rounded-pill px-4">
                Order Something Else
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
