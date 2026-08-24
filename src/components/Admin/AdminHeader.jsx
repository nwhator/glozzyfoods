import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";

const AdminHeader = () => {
  const { currentUser, logout } = useAuth();
  const { orders } = useStore();

  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;

  return (
    <header className="admin-header py-3 px-4 d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 999 }}>
      <div className="d-flex align-items-center gap-3">
        <h4 className="fw-bold mb-0">Management Portal</h4>
        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 small">
          ● Live
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Pending Orders Alert */}
        <Link
          to="/admin/orders?status=Pending"
          className="btn btn-light rounded-pill position-relative d-flex align-items-center gap-2 small px-3 py-2"
        >
          <i className="fa-solid fa-bell text-warning"></i>
          <span className="fw-semibold">Pending</span>
          {pendingCount > 0 && (
            <span className="badge bg-danger rounded-pill">{pendingCount}</span>
          )}
        </Link>

        {/* View Storefront */}
        <Link
          to="/"
          className="btn btn-glozzy-primary btn-sm rounded-pill px-3"
          title="Visit Customer Store"
        >
          <i className="fa-solid fa-store me-1"></i> Store
        </Link>

        {/* Admin Avatar */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <div
            className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px", background: "var(--g-accent)" }}
          >
            GA
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px" }}
            onClick={logout}
            title="Log Out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
