import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const STATUS_TABS = ["All", "Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const { orders, formatNaira, updateOrderStatus } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get("status") || "All";
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const handleTabChange = (status) => {
    if (status === "All") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  };

  const filteredOrders = orders.filter((o) => {
    if (currentTab !== "All" && o.orderStatus !== currentTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone;
    }
    return true;
  });

  const handleOpenDetail = (o) => {
    setSelectedOrder(o);
    setNewStatus(o.orderStatus);
    setInternalNotes(o.internalNotes || "");
  };

  const handleSaveStatus = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus, internalNotes);
      setSelectedOrder(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Kitchen & Orders Manager</h2>
          <p className="text-muted small mb-0">
            Track incoming food orders, update cooking stages, manage riders, and print receipts.
          </p>
        </div>
        <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill font-monospace">
          {orders.length} Total Orders Recorded
        </span>
      </div>

      {/* Tabs & Search */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        {/* Status Tabs */}
        <div className="d-flex flex-wrap gap-1 mb-3 border-bottom pb-2">
          {STATUS_TABS.map((tab) => {
            const count = tab === "All" ? orders.length : orders.filter((o) => o.orderStatus === tab).length;
            return (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm ${
                  currentTab === tab ? "btn-danger fw-bold" : "btn-light text-dark"
                } rounded-pill px-3 py-1`}
                onClick={() => handleTabChange(tab)}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="fa-solid fa-magnifying-glass text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by Order # (e.g. GF-849201), Customer Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer Details</th>
                <th>Destination / Type</th>
                <th>Dishes</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Placed At</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted small">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong className="text-danger font-monospace fs-6">{o.orderNumber}</strong>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{o.customerName}</div>
                      <small className="text-muted">{o.customerPhone}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border d-block mb-1 text-truncate" style={{ maxWidth: "160px" }}>
                        {o.orderType === "pickup" ? "Store Pickup" : o.deliveryZone}
                      </span>
                      <small className="text-muted d-block text-truncate" style={{ maxWidth: "160px" }}>
                        {o.deliveryAddress}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary rounded-pill">
                        {o.items?.length || 0} items
                      </span>
                    </td>
                    <td>
                      <strong className="text-danger">{formatNaira(o.total)}</strong>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                        {o.paymentStatus} ({o.paymentMethod})
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          o.orderStatus === "Delivered"
                            ? "bg-success"
                            : o.orderStatus === "Cancelled"
                            ? "bg-danger"
                            : o.orderStatus === "Out for Delivery"
                            ? "bg-info text-dark"
                            : "bg-warning text-dark"
                        } rounded-pill px-3 py-1`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                        onClick={() => handleOpenDetail(o)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAIL & STATUS UPDATE MODAL */}
      <Modal show={!!selectedOrder} onHide={() => setSelectedOrder(null)} size="lg" centered>
        {selectedOrder && (
          <>
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold text-dark">
                  Order Management: <span className="text-danger font-monospace">{selectedOrder.orderNumber}</span>
                </h5>
                <small className="text-muted">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </small>
              </div>
              <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
            </div>

            <div className="modal-body p-4">
              {/* Customer & Address Details */}
              <div className="row g-3 p-3 bg-light rounded-4 mb-4 small">
                <div className="col-md-6">
                  <strong>Customer:</strong> {selectedOrder.customerName}
                  <br />
                  <strong>Phone:</strong> {selectedOrder.customerPhone}
                  <br />
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </div>
                <div className="col-md-6">
                  <strong>Delivery Zone:</strong> {selectedOrder.deliveryZone}
                  <br />
                  <strong>Address:</strong> {selectedOrder.deliveryAddress}
                  <br />
                  {selectedOrder.customerNotes && (
                    <div className="text-danger mt-1">
                      <strong>Customer Notes:</strong> <em>{selectedOrder.customerNotes}</em>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <h6 className="fw-bold text-dark mb-2">Order Items:</h6>
              <div className="table-responsive mb-4">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Variant</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="rounded-2 object-fit-cover"
                              style={{ width: "36px", height: "36px" }}
                            />
                            <strong className="text-dark small">{item.productName}</strong>
                          </div>
                        </td>
                        <td><small className="text-muted">{item.variantName}</small></td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{formatNaira(item.price)}</td>
                        <td className="text-end fw-bold">{formatNaira(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Totals */}
              <div className="d-flex justify-content-end mb-4">
                <div style={{ minWidth: "220px" }} className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Subtotal:</span>
                    <strong className="text-dark">{formatNaira(selectedOrder.subtotal)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Delivery Fee:</span>
                    <strong className="text-dark">{formatNaira(selectedOrder.deliveryFee)}</strong>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="d-flex justify-content-between mb-1 text-success">
                      <span>Discount:</span>
                      <strong>-{formatNaira(selectedOrder.discount)}</strong>
                    </div>
                  )}
                  <div className="d-flex justify-content-between border-top pt-1 mt-1">
                    <span className="fw-bold text-dark fs-6">Grand Total:</span>
                    <span className="fw-bold text-danger fs-5">{formatNaira(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="p-3 rounded-4 bg-white border border-danger border-opacity-25">
                <h6 className="fw-bold text-danger mb-3">
                  <i className="fa-solid fa-bell-concierge me-1"></i> Update Kitchen & Dispatch Status
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Order Lifecycle Status</label>
                    <select
                      className="form-select rounded-3"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Pending">Pending (Received)</option>
                      <option value="Confirmed">Confirmed (Accepted)</option>
                      <option value="Preparing">Preparing (Cooking / Baking)</option>
                      <option value="Ready">Ready (Packaged)</option>
                      <option value="Out for Delivery">Out for Delivery (With Rider)</option>
                      <option value="Delivered">Delivered (Completed)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Internal / Dispatch Notes</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Rider John dispatched on bike..."
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={handlePrint}>
                <i className="fa-solid fa-print me-1"></i> Print Receipt
              </button>
              <button type="button" className="btn btn-light rounded-pill" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
              <button type="button" className="btn btn-glozzy-primary rounded-pill px-4" onClick={handleSaveStatus}>
                Update Order Status
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
