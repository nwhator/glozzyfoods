import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const AdminOverview = () => {
  const { orders, products, categories, formatNaira, updateOrderStatus } = useStore();

  // Metrics
  const totalSales = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + o.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const completedOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const lowStockProducts = products.filter((p) => p.trackInventory && p.stock <= 10);
  const activeProductsCount = products.filter((p) => p.active).length;

  // Selected order for quick status update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setInternalNote(order.internalNotes || "");
  };

  const handleSaveStatus = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus, internalNote);
      setSelectedOrder(null);
    }
  };

  return (
    <div>
      {/* Page Title & Quick Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Business Dashboard Overview</h2>
          <p className="text-muted small mb-0">
            Real-time analytics for GlozzyFoods ND More sales, kitchen orders, and inventory.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn btn-glozzy-primary btn-sm rounded-pill px-3">
            <i className="fa-solid fa-plus me-1"></i> Add New Product
          </Link>
          <Link to="/admin/coupons" className="btn btn-outline-dark btn-sm rounded-pill px-3">
            <i className="fa-solid fa-ticket me-1"></i> New Promo
          </Link>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="row g-4 mb-4">
        {/* Total Sales */}
        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold">TOTAL SALES REVENUE</span>
              <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                <i className="fa-solid fa-money-bill-wave fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{formatNaira(totalSales)}</h3>
            <span className="small text-success fw-semibold">
              <i className="fa-solid fa-arrow-trend-up me-1"></i> Verified Paid Orders
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold">TOTAL ORDERS</span>
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                <i className="fa-solid fa-receipt fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{totalOrders}</h3>
            <span className="small text-muted">
              {completedOrders} Delivered &bull; {pendingOrders} Pending
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold">PENDING ORDERS</span>
              <div className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                <i className="fa-solid fa-kitchen-set fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold text-dark mb-1">{pendingOrders}</h3>
            <Link to="/admin/orders" className="small text-danger fw-semibold text-decoration-none">
              Manage in kitchen &rarr;
            </Link>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="col-xl-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold">LOW STOCK ALERTS</span>
              <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                <i className="fa-solid fa-triangle-exclamation fs-5"></i>
              </div>
            </div>
            <h3 className="fw-bold text-danger mb-1">{lowStockProducts.length}</h3>
            <Link to="/admin/inventory" className="small text-muted text-decoration-none">
              {activeProductsCount} Active catalog products
            </Link>
          </div>
        </div>
      </div>

      {/* SALES TRENDS & CATEGORY DISTRIBUTION */}
      <div className="row g-4 mb-4">
        {/* Category Breakdown */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Menu Category Distribution</h5>
            <div className="d-flex flex-column gap-3">
              {categories.slice(0, 6).map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const percentage = Math.round((count / products.length) * 100) || 10;
                return (
                  <div key={cat.id}>
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span>{cat.name}</span>
                      <span className="text-muted">{count} items ({percentage}%)</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-top text-center">
              <Link to="/admin/categories" className="small text-danger fw-bold text-decoration-none">
                Manage All {categories.length} Categories &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Top Customer Favourites</h5>
              <Link to="/admin/products" className="text-danger small fw-semibold text-decoration-none">
                View All
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Dish</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="rounded-2 object-fit-cover"
                            style={{ width: "36px", height: "36px" }}
                          />
                          <span className="fw-bold text-dark small">{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border small">{p.categoryName}</span>
                      </td>
                      <td className="fw-bold text-danger small">
                        {formatNaira(p.discountPrice || p.price)}
                      </td>
                      <td>
                        <span className={`badge ${p.stock <= 5 ? "bg-danger" : "bg-success"} rounded-pill`}>
                          {p.stock} left
                        </span>
                      </td>
                      <td className="small text-warning">
                        <i className="fa-solid fa-star me-1"></i>
                        {p.rating || "5.0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Recent Orders Live Queue</h5>
          <Link to="/admin/orders" className="btn btn-outline-danger btn-sm rounded-pill px-3">
            Open Full Orders Manager
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong className="text-danger font-monospace">{o.orderNumber}</strong>
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{o.customerName}</div>
                    <small className="text-muted">{o.customerPhone}</small>
                  </td>
                  <td>
                    <small className="text-muted text-truncate d-block" style={{ maxWidth: "200px" }}>
                      {o.deliveryAddress}
                    </small>
                  </td>
                  <td className="fw-bold text-dark">{formatNaira(o.total)}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        o.orderStatus === "Delivered"
                          ? "bg-success"
                          : o.orderStatus === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      } rounded-pill px-3 py-1`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      onClick={() => handleOpenStatusModal(o)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK STATUS UPDATE MODAL */}
      <Modal show={!!selectedOrder} onHide={() => setSelectedOrder(null)} centered>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark">
            Update Order Status: <span className="text-danger font-monospace">{selectedOrder?.orderNumber}</span>
          </h5>
          <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label small fw-bold">Select New Status</label>
            <select
              className="form-select rounded-3"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending (Received)</option>
              <option value="Confirmed">Confirmed (Accepted)</option>
              <option value="Preparing">Preparing (Cooking / Decorating)</option>
              <option value="Ready">Ready (Packaged for Pickup/Dispatch)</option>
              <option value="Out for Delivery">Out for Delivery (With Rider)</option>
              <option value="Delivered">Delivered (Completed)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Internal / Dispatch Note</label>
            <textarea
              className="form-control rounded-3"
              rows="3"
              placeholder="e.g. Assigned to dispatch rider Emmanuel..."
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer border-0">
          <button type="button" className="btn btn-light rounded-pill" onClick={() => setSelectedOrder(null)}>
            Cancel
          </button>
          <button type="button" className="btn btn-glozzy-primary rounded-pill px-4" onClick={handleSaveStatus}>
            Save Status
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOverview;
