import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, isAdmin } = useAuth();
  const { orders, formatNaira, addToCart, products } = useStore();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [savedMsg, setSavedMsg] = useState("");

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
        <div className="row g-4">
          {/* PROFILE SIDEBAR */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center mb-4">
              <div
                className="rounded-circle bg-danger text-white fs-2 fw-bold d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h5 className="fw-bold text-dark mb-1">{currentUser.name}</h5>
              <p className="text-muted small mb-3">{currentUser.email}</p>

              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">
                  {currentUser.role === "admin" ? "Administrator" : "Valued Customer"}
                </span>
                <span className="badge bg-light text-muted border rounded-pill px-3 py-1">
                  {userOrders.length} Orders Placed
                </span>
              </div>

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

          {/* MAIN COLUMN: PROFILE SETTINGS & ORDER HISTORY */}
          <div className="col-lg-8">
            {savedMsg && (
              <div className="alert alert-success rounded-4 py-2 px-3 small mb-4 shadow-sm">
                <i className="fa-solid fa-check-circle me-2"></i> {savedMsg}
              </div>
            )}

            {/* PROFILE DETAILS FORM */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">My Contact & Delivery Details</h5>
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
                      rows="2"
                      placeholder="e.g. 14 Reservation Road, GRA, Benin City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* ORDER HISTORY */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Order History ({userOrders.length})</h5>
                <Link to="/shop" className="text-danger small fw-semibold text-decoration-none">
                  Order Food &rarr;
                </Link>
              </div>

              {userOrders.length === 0 ? (
                <p className="text-muted small py-4 text-center">
                  You haven't placed any orders yet. Treat yourself today!
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {userOrders.map((order) => (
                    <div className="p-3 rounded-4 border bg-light" key={order.id}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <div>
                          <strong className="text-danger font-monospace fs-6 d-block">
                            {order.orderNumber}
                          </strong>
                          <small className="text-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; {order.items?.length || 0} items
                          </small>
                        </div>
                        <span className="badge bg-warning text-dark rounded-pill px-3 py-1">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                        <span className="fw-bold text-dark">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
