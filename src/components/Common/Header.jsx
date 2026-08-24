import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { Dropdown } from "react-bootstrap";

const Header = () => {
  const { cartCount, cartSubtotal, formatNaira, categories, cms, wishlist } = useStore();
  const { currentUser, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="glozzy-topbar">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span>{cms?.topbarNotice || "🔥 Fast delivery in Benin City! Call/WhatsApp: +234 703 551 8331"}</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link to="/order-tracking" className="d-none d-md-inline text-white opacity-75">
                <i className="fa-solid fa-truck-fast me-1"></i> Track Order
              </Link>
              <Link to="/admin" className="badge bg-dark text-white px-2 py-1" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
                <i className="fa-solid fa-shield-halved me-1"></i> Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="glozzy-navbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Logo */}
            <Link to="/" className="glozzy-logo-wrap text-decoration-none">
              <div className="glozzy-logo-badge">GF</div>
              <div>
                <h1 className="glozzy-brand-title">{cms?.storeContact?.brandName || "GLOZZYFOODS"}</h1>
                <p className="glozzy-brand-subtitle">{cms?.storeContact?.subBrand || "ND MORE"}</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="d-none d-lg-flex align-items-center gap-1">
              <Link to="/" className="glozzy-nav-link">Home</Link>
              <Link to="/shop" className="glozzy-nav-link">Menu</Link>

              {/* Categories Dropdown */}
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle as="a" className="glozzy-nav-link text-decoration-none cursor-pointer" id="cat-drop">
                  Categories <i className="fa-solid fa-angle-down ms-1" style={{ fontSize: "11px" }}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg mt-2 p-2 rounded-3" style={{ minWidth: "220px" }}>
                  {categories.filter((c) => c.active).map((cat) => (
                    <Dropdown.Item
                      as={Link}
                      to={`/category/${cat.slug}`}
                      key={cat.id}
                      className="py-2 px-3 rounded-2 fw-medium"
                    >
                      <i className="fa-solid fa-utensils me-2 text-danger opacity-75"></i>
                      {cat.name}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/shop" className="text-danger fw-bold">
                    View All Categories &rarr;
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Link to="/catering" className="glozzy-nav-link">Catering</Link>
              <Link to="/about" className="glozzy-nav-link">About</Link>
              <Link to="/contact" className="glozzy-nav-link">Contact</Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="d-none d-md-flex align-items-center flex-grow-1 mx-3" style={{ maxWidth: "280px" }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-start-pill border-end-0 ps-3"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: "13px", height: "40px" }}
                />
                <button
                  type="submit"
                  className="btn btn-outline-secondary rounded-end-pill border-start-0 pe-3"
                  style={{ color: "var(--g-accent)" }}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="d-flex align-items-center gap-2">
              {/* Wishlist */}
              <Link
                to="/shop"
                className="btn btn-light rounded-circle position-relative d-none d-sm-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                title="Wishlist"
              >
                <i className="fa-regular fa-heart text-danger"></i>
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="btn btn-glozzy-primary d-flex align-items-center gap-2 py-2 px-3"
                title="View Cart"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span className="badge bg-dark text-white fw-bold rounded-pill" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>{cartCount}</span>
                <span className="d-none d-xl-inline">{formatNaira(cartSubtotal)}</span>
              </Link>

              {/* User Account */}
              {currentUser ? (
                <Dropdown className="d-inline-block">
                  <Dropdown.Toggle as="button" className="btn btn-light rounded-pill d-flex align-items-center gap-2 py-2 px-3">
                    <i className="fa-solid fa-circle-user text-danger"></i>
                    <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: "13px" }}>
                      {currentUser.name?.split(" ")[0]}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="shadow-lg mt-2 p-2 rounded-3" style={{ minWidth: "200px" }}>
                    <div className="px-3 py-2 border-bottom mb-2">
                      <p className="fw-bold mb-0">{currentUser.name}</p>
                      <small className="text-muted">{currentUser.email}</small>
                    </div>
                    <Dropdown.Item as={Link} to="/account" className="py-2">
                      <i className="fa-solid fa-user me-2 text-muted"></i> My Account
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/account" className="py-2">
                      <i className="fa-solid fa-receipt me-2 text-muted"></i> Order History
                    </Dropdown.Item>
                    {isAdmin && (
                      <Dropdown.Item as={Link} to="/admin" className="py-2 text-danger fw-bold">
                        <i className="fa-solid fa-gauge me-2"></i> Admin Dashboard
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="py-2 text-danger">
                      <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link to="/login" className="btn btn-outline-danger rounded-pill px-3 py-2 fw-semibold d-none d-sm-inline-flex" style={{ fontSize: "13px" }}>
                  <i className="fa-regular fa-user me-1"></i> Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="btn btn-light rounded-circle d-lg-none d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} fs-5`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Menu */}
          {mobileMenuOpen && (
            <div className="d-lg-none mt-3 pt-3 border-top">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-start-pill ps-3"
                    placeholder="Search cakes, snacks, jollof..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-danger rounded-end-pill px-3">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </form>
              <div className="d-flex flex-column gap-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-house me-2 text-danger"></i> Home
                </Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-utensils me-2 text-danger"></i> Full Menu
                </Link>
                <Link to="/catering" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-champagne-glasses me-2 text-danger"></i> Event Catering
                </Link>
                <Link to="/order-tracking" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-truck-fast me-2 text-danger"></i> Track Order
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-circle-info me-2 text-danger"></i> About Us
                </Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-2 fw-semibold">
                  <i className="fa-solid fa-phone me-2 text-danger"></i> Contact
                </Link>
                {!currentUser && (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-danger w-100 mt-2 rounded-pill py-2">
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
