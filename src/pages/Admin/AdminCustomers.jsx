import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "react-bootstrap";

const AdminCustomers = () => {
  const { users } = useAuth();
  const { orders, formatNaira } = useStore();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const customersList = users
    .filter((u) => u.role === "customer" || !u.role)
    .map((user) => {
      const userOrders = orders.filter(
        (o) =>
          o.userId === user.id ||
          o.customerEmail?.toLowerCase() === user.email?.toLowerCase() ||
          o.customerPhone === user.phone
      );
      const totalSpent = userOrders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.total, 0);

      return {
        ...user,
        ordersCount: userOrders.length,
        totalSpent: totalSpent,
        ordersList: userOrders,
      };
    });

  const filtered = customersList.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Customer Accounts Directory</h2>
          <p className="text-muted small mb-0">
            View registered food lovers, total order history, and lifetime customer spend.
          </p>
        </div>
        <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">
          {customersList.length} Registered Customers
        </span>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="fa-solid fa-magnifying-glass text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by customer name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Delivery Address</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-danger bg-opacity-10 text-danger fw-bold d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                        {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <strong className="text-dark d-block">{c.name}</strong>
                        <small className="text-muted">{c.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="small text-dark font-monospace">{c.phone || "+234 800 000 0000"}</span>
                  </td>
                  <td className="small text-muted" style={{ maxWidth: "200px" }}>
                    {c.address || "Benin City, Edo State"}
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-1">
                      {c.ordersCount} Orders
                    </span>
                  </td>
                  <td>
                    <strong className="text-success">{formatNaira(c.totalSpent)}</strong>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      Order History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER ORDER HISTORY MODAL */}
      <Modal show={!!selectedCustomer} onHide={() => setSelectedCustomer(null)} size="lg" centered>
        {selectedCustomer && (
          <>
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold text-dark">{selectedCustomer.name}'s Profile</h5>
                <small className="text-muted">{selectedCustomer.email} &bull; {selectedCustomer.phone}</small>
              </div>
              <button type="button" className="btn-close" onClick={() => setSelectedCustomer(null)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between p-3 bg-light rounded-4 mb-4">
                <div>
                  <small className="text-muted d-block">Total Orders</small>
                  <strong className="fs-5 text-dark">{selectedCustomer.ordersCount}</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Lifetime Spend</small>
                  <strong className="fs-5 text-success">{formatNaira(selectedCustomer.totalSpent)}</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Default Address</small>
                  <span className="small text-dark">{selectedCustomer.address || "Benin City"}</span>
                </div>
              </div>

              <h6 className="fw-bold text-dark mb-3">Order History:</h6>
              {selectedCustomer.ordersList?.length === 0 ? (
                <p className="text-muted small">No recorded orders for this customer yet.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {selectedCustomer.ordersList?.map((o) => (
                    <div className="p-3 border rounded-3 bg-white d-flex justify-content-between align-items-center" key={o.id}>
                      <div>
                        <strong className="text-danger font-monospace">{o.orderNumber}</strong>
                        <small className="text-muted d-block">{new Date(o.createdAt).toLocaleDateString()} &bull; {o.items?.length} items</small>
                      </div>
                      <span className="badge bg-warning text-dark px-3 py-1 rounded-pill">{o.orderStatus}</span>
                      <strong className="text-dark">{formatNaira(o.total)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light rounded-pill" onClick={() => setSelectedCustomer(null)}>
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminCustomers;
