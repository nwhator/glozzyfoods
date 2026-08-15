import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount } = useStore();
  const { currentUser } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="glozzy-mobile-nav">
      <Link to="/" className={`glozzy-mobile-nav-item ${isActive("/") ? "active" : ""}`}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>

      <Link to="/shop" className={`glozzy-mobile-nav-item ${isActive("/shop") ? "active" : ""}`}>
        <i className="fa-solid fa-utensils"></i>
        <span>Menu</span>
      </Link>

      <Link to="/catering" className={`glozzy-mobile-nav-item ${isActive("/catering") ? "active" : ""}`}>
        <i className="fa-solid fa-champagne-glasses"></i>
        <span>Catering</span>
      </Link>

      <Link to="/cart" className={`glozzy-mobile-nav-item ${isActive("/cart") ? "active" : ""}`}>
        <i className="fa-solid fa-bag-shopping"></i>
        {cartCount > 0 && <span className="glozzy-cart-badge">{cartCount}</span>}
        <span>Cart</span>
      </Link>

      <Link
        to={currentUser ? "/account" : "/login"}
        className={`glozzy-mobile-nav-item ${isActive("/account") || isActive("/login") ? "active" : ""}`}
      >
        <i className="fa-solid fa-user"></i>
        <span>{currentUser ? "Account" : "Login"}</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
