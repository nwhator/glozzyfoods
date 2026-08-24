import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, isAdmin } = useAuth();
  const { orders, formatNaira, addToCart, products } = useStore();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [savedMsg, setSavedMsg] = useState("");
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "profile"

  if (!currentUser) {
    navigate("/login?redirect=/account");
    return null;
  }

  // Filter orders by this user
  const userOrders = orders.filter(
    (o) =>
      o.userId === currentUser.id ||
      o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      o.customerPhone === currentUser.phone
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, address });
    setSavedMsg("Profile information updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, null, item.quantity);
      }
    });
    navigate("/cart");
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
              My Account
            </li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* PROFILE SIDEBAR */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-card text-center mb-4">
              <div
                className="rounded-circle text-white fs-2 fw-bold d-inline-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                style={{ width: "80px", height: "80px", backgroundColor: "var(--g-accent)" }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h5 className="fw-bold text-white mb-1">{currentUser.name || "Customer"}</h5>
              <p className="text-muted small mb-3">{currentUser.email}</p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold">
                  {currentUser.role === "admin" ? "Administrator" : "Valued Customer"}
                </span>
                <span className="badge bg-light text-muted border rounded-pill px-3 py-1">
                  {userOrders.length} {userOrders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>

              {/* Tab Navigation Pills */}
              <ul className="nav nav-pills flex-column gap-2 my-3 text-start">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${
                      activeTab === "orders" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>Order History</span>
                    <span className="badge ms-auto bg-dark border text-muted rounded-pill">
                      {userOrders.length}
                    </span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${
                      activeTab === "profile" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="fa-solid fa-user-pen"></i>
                    <span>Profile Details</span>
                  </button>
                </li>
              </ul>

              {isAdmin && (
                <Link to="/admin" className="btn btn-warning text-dark fw-bold rounded-pill w-100 mb-2">
                  <i className="fa-solid fa-gauge me-1"></i> Go to Admin Dashboard
                </Link>
              )}

              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-pill w-100"
                onClick={logout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket me-1"></i> Sign Out
              </button>
            </div>
          </div>

          {/* MAIN COLUMN: PROFILE SETTINGS OR ORDER HISTORY */}
          <div className="col-lg-8">
            {savedMsg && (
              <div className="alert alert-success rounded-4 py-2 px-3 small mb-4 shadow-sm">
                <i className="fa-solid fa-check-circle me-2"></i> {savedMsg}
              </div>
            )}

            {activeTab === "profile" ? (
              /* PROFILE DETAILS FORM */
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-card mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-white mb-0">My Contact & Delivery Details</h5>
                  <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 small">
                    Settings
                  </span>
                </div>
                <form onSubmit={handleSaveProfile}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone Number (WhatsApp)</label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Default Delivery Address</label>
                      <textarea
                        className="form-control rounded-3"
                        rows="3"
                        placeholder="e.g. 14 Reservation Road, GRA, Benin City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
                        <i className="fa-solid fa-floppy-disk me-1"></i> Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* ORDER HISTORY */
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-white mb-0">Order History ({userOrders.length})</h5>
                  <Link to="/shop" className="text-danger small fw-semibold text-decoration-none">
                    Order Food &rarr;
                  </Link>
                </div>

                {userOrders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-receipt fs-1 text-muted mb-3 d-block"></i>
                    <h6 className="fw-bold text-white mb-1">No orders yet</h6>
                    <p className="text-muted small mb-3">
                      You haven't placed any orders yet. Treat yourself today!
                    </p>
                    <Link to="/shop" className="btn btn-glozzy-primary btn-sm rounded-pill px-4">
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {userOrders.map((order) => (
                      <div className="p-3 rounded-4 border bg-elevated" key={order.id}>
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                          <div>
                            <strong className="text-danger font-monospace fs-6 d-block">
                              {order.orderNumber}
                            </strong>
                            <small className="text-muted">
                              Placed on {new Date(order.createdAt).toLocaleDateString()} &bull;{" "}
                              {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                            </small>
                          </div>
                          <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold">
                            {order.orderStatus}
                          </span>
                        </div>

                        {/* Order items preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="py-2">
                            <div className="text-muted small">
                              {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}
                            </div>
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                          <span className="fw-bold text-white">
                            Total: <span className="text-danger">{formatNaira(order.total)}</span>
                          </span>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/order-tracking?orderId=${order.orderNumber}`}
                              className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            >
                              <i className="fa-solid fa-truck-fast me-1"></i> Track
                            </Link>
                            <button
                              type="button"
                              className="btn btn-glozzy-primary btn-sm rounded-pill px-3"
                              onClick={() => handleReorder(order)}
                            >
                              <i className="fa-solid fa-rotate me-1"></i> Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
