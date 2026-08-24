import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const Footer = () => {
  const { categories, cms } = useStore();
  const phone = cms?.storeContact?.phone || "+234 703 551 8331";
  const whatsapp = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <footer className="glozzy-footer pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Col */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="glozzy-logo-badge">GF</div>
              <div>
                <h4 className="fw-bold mb-0">{cms?.storeContact?.brandName || "GLOZZYFOODS"}</h4>
                <span className="text-danger small fw-bold">{cms?.storeContact?.subBrand || "ND MORE"}</span>
              </div>
            </div>
            <p className="text-muted mb-3" style={{ fontSize: "14px", lineHeight: "1.7" }}>
              Great Food. Great Taste. Every Time. Authentic Nigerian dishes, celebration cakes, crispy small chops, fresh fruit parfaits, and drinks delivered to your doorstep.
            </p>
            <div className="d-flex align-items-center gap-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glozzy-whatsapp btn-sm px-3"
              >
                <i className="fa-brands fa-whatsapp me-1"></i> WhatsApp Us
              </a>
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="btn btn-outline-light btn-sm px-3 rounded-pill">
                <i className="fa-solid fa-phone me-1"></i> Call
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-danger fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: "14px" }}>
              <li><Link to="/shop" className="text-muted text-decoration-none">&rsaquo; Full Menu</Link></li>
              <li><Link to="/catering" className="text-muted text-decoration-none">&rsaquo; Event Catering</Link></li>
              <li><Link to="/order-tracking" className="text-muted text-decoration-none">&rsaquo; Track Order</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none">&rsaquo; Our Story</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none">&rsaquo; Contact Us</Link></li>
            </ul>
          </div>

          {/* Top Food Categories */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-danger fw-bold mb-3">Categories</h5>
            <div className="d-flex flex-wrap gap-2">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="badge text-decoration-none px-3 py-2 rounded-pill"
                  style={{ background: "var(--g-bg-elevated)", color: "var(--g-text-secondary)", border: "1px solid var(--g-border)", fontSize: "12px" }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="mt-3">
              <span className="small text-muted d-block">
                <i className="fa-solid fa-clock text-danger me-2"></i>
                {cms?.storeContact?.hours || "Mon - Sat: 8am - 9pm | Sun: 11am - 7pm"}
              </span>
            </div>
          </div>

          {/* Contact & Payment */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-danger fw-bold mb-3">Contact & Orders</h5>
            <p className="text-muted small mb-2">
              <i className="fa-solid fa-location-dot text-danger me-2"></i>
              {cms?.storeContact?.address || "Benin City, Edo State, Nigeria"}
            </p>
            <p className="text-muted small mb-2">
              <i className="fa-solid fa-phone text-danger me-2"></i>
              {phone}
            </p>
            <p className="text-muted small mb-3">
              <i className="fa-solid fa-envelope text-danger me-2"></i>
              {cms?.storeContact?.email || "orders@glozzyfoods.com"}
            </p>

            <div className="p-3 rounded-3" style={{ background: "var(--g-bg-elevated)", border: "1px solid var(--g-border)" }}>
              <span className="small fw-bold d-block mb-1">We Accept:</span>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge rounded-pill px-2 py-1" style={{ background: "var(--g-bg-card)", border: "1px solid var(--g-border)", color: "var(--g-accent)" }}>Paystack</span>
                <span className="badge rounded-pill px-2 py-1" style={{ background: "var(--g-bg-card)", border: "1px solid var(--g-border)", color: "var(--g-text-secondary)" }}>Bank Transfer</span>
                <span className="badge rounded-pill px-2 py-1" style={{ background: "var(--g-bg-card)", border: "1px solid var(--g-border)", color: "var(--g-text-secondary)" }}>Cash</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top pt-4 d-flex justify-content-between align-items-center flex-wrap gap-2 text-muted small">
          <div>
            &copy; {new Date().getFullYear()} <strong>GLOZZYFOODS ND MORE</strong>. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/privacy-policy" className="text-muted text-decoration-none">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="text-muted text-decoration-none">Terms</Link>
            <span>&bull;</span>
            <Link to="/admin" className="text-danger text-decoration-none">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
