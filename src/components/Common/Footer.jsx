import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const Footer = () => {
  const { categories, cms } = useStore();
  const phone = cms?.storeContact?.phone || "+234 703 551 8331";
  const whatsapp = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5 border-top border-danger border-3">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Col */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="glozzy-logo-badge">GF</div>
              <div>
                <h4 className="text-white fw-bold mb-0">{cms?.storeContact?.brandName || "GLOZZYFOODS"}</h4>
                <span className="text-warning small fw-bold">{cms?.storeContact?.subBrand || "ND MORE"}</span>
              </div>
            </div>
            <p className="text-white-50 mb-3" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Great Food. Great Taste. Every Time. We bring authentic Nigerian dishes, celebration cakes, crispy small chops, fresh fruit parfaits, and drinks straight to your doorstep.
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
            <h5 className="text-warning fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: "14px" }}>
              <li>
                <Link to="/shop" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; All Menu Dishes
                </Link>
              </li>
              <li>
                <Link to="/catering" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; Event Catering
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; Track My Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white-50 text-decoration-none hover-text-white">
                  &rsaquo; FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Food Categories */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-warning fw-bold mb-3">Top Categories</h5>
            <div className="d-flex flex-wrap gap-2">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="badge bg-secondary bg-opacity-25 text-white text-decoration-none px-3 py-2 rounded-pill hover-bg-danger"
                  style={{ fontSize: "12px" }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="mt-3">
              <span className="small text-white-50 d-block">
                <i className="fa-solid fa-clock text-warning me-2"></i>
                {cms?.storeContact?.hours || "Mon - Sat: 8am - 9pm | Sun: 11am - 7pm"}
              </span>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-warning fw-bold mb-3">Contact & Orders</h5>
            <p className="text-white-50 small mb-2">
              <i className="fa-solid fa-location-dot text-danger me-2"></i>
              {cms?.storeContact?.address || "Benin City, Edo State, Nigeria"}
            </p>
            <p className="text-white-50 small mb-2">
              <i className="fa-solid fa-phone text-danger me-2"></i>
              {phone}
            </p>
            <p className="text-white-50 small mb-3">
              <i className="fa-solid fa-envelope text-danger me-2"></i>
              {cms?.storeContact?.email || "orders@glozzyfoods.com"}
            </p>

            <div className="p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
              <span className="small fw-bold text-white d-block mb-1">We Accept:</span>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-dark border border-secondary text-warning">Paystack</span>
                <span className="badge bg-dark border border-secondary text-light">Bank Transfer</span>
                <span className="badge bg-dark border border-secondary text-light">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-4 d-flex justify-content-between align-items-center flex-wrap gap-2 text-white-50 small">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">GLOZZYFOODS ND MORE</strong>. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/privacy-policy" className="text-white-50 text-decoration-none hover-text-white">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="text-white-50 text-decoration-none hover-text-white">Terms & Conditions</Link>
            <span>&bull;</span>
            <Link to="/admin" className="text-warning text-decoration-none">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
