import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "fa-solid fa-gauge" },
  { path: "/admin/products", label: "Products Catalog", icon: "fa-solid fa-utensils" },
  { path: "/admin/categories", label: "Categories", icon: "fa-solid fa-list" },
  { path: "/admin/orders", label: "Orders", icon: "fa-solid fa-receipt" },
  { path: "/admin/customers", label: "Customers", icon: "fa-solid fa-users" },
  { path: "/admin/inventory", label: "Inventory", icon: "fa-solid fa-boxes-stacked" },
  { path: "/admin/coupons", label: "Coupons & Promos", icon: "fa-solid fa-ticket" },
  { path: "/admin/delivery-zones", label: "Delivery Zones", icon: "fa-solid fa-map-location-dot" },
  { path: "/admin/homepage-cms", label: "Homepage CMS", icon: "fa-solid fa-pen-ruler" },
  { path: "/admin/reviews", label: "Customer Reviews", icon: "fa-solid fa-star" },
  { path: "/admin/settings", label: "Settings", icon: "fa-solid fa-gear" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar d-flex flex-column py-4" style={{ width: "260px" }}>
      {/* Brand */}
      <div className="px-4 mb-4">
        <Link to="/admin" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="glozzy-logo-badge" style={{ padding: "4px 10px", fontSize: "16px" }}>GF</div>
          <div>
            <h5 className="text-white fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>GLOZZYFOODS</h5>
            <span className="badge bg-warning text-dark small fw-bold" style={{ fontSize: "10px" }}>ADMIN MANAGER</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 overflow-auto px-2">
        <div className="d-flex flex-column gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item text-decoration-none ${isActive(item.path) ? "active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer Profile & Switch to Store */}
      <div className="px-3 pt-3 border-top border-secondary border-opacity-25 mt-auto">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-warning btn-sm w-100 mb-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
        >
          <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Live Storefront
        </Link>

        <div className="d-flex align-items-center justify-content-between text-muted small px-2">
          <div className="d-flex align-items-center gap-2 text-white-50">
            <i className="fa-solid fa-circle-user text-success"></i>
            <span className="text-truncate" style={{ maxWidth: "110px" }}>{currentUser?.name || "Admin"}</span>
          </div>
          <button
            type="button"
            className="btn btn-link text-danger p-0 text-decoration-none small"
            onClick={logout}
            title="Log Out"
          >
            <i className="fa-solid fa-power-off"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
