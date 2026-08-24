import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import QuickViewModal from "../../components/Common/QuickViewModal";

const HomePage = () => {
  const { categories, products, cms } = useStore();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();

  const hero = cms?.hero || {
    tagline: "Authentic Nigerian Dishes & Handcrafted Confectioneries",
    title: "Delicious Food, Delivered In Minutes.",
    highlightText: "GlozzyFoods ND More",
    description:
      "Fresh African dishes, celebration cakes, crispy small chops, refreshing chilled drinks and artisan fruit parfaits made with passion in Benin City.",
    primaryCtaText: "Explore Full Menu",
    secondaryCtaText: "Event Catering",
    bannerImage:
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80",
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  // Filter dishes by category tab
  const featuredProducts = products.filter((p) => p.active && (p.featured || selectedCategoryTab !== "all"));
  const filteredProducts =
    selectedCategoryTab === "all"
      ? featuredProducts.slice(0, 8)
      : products.filter((p) => p.active && p.categoryId === selectedCategoryTab);

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="glozzy-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              {/* Micro-Pill Tag */}
              <div className="glozzy-hero-tag mb-3">
                <span className="badge bg-danger rounded-pill px-2 py-1 me-1 text-white" style={{ fontSize: "10px" }}>
                  BENIN CITY
                </span>
                <span>{hero.tagline}</span>
              </div>

              {/* Headline */}
              <h1 className="glozzy-hero-title mb-3">
                Have delicious food <br />
                <span className="text-danger">delivered to your doorstep.</span>
              </h1>
              <p className="glozzy-hero-desc mb-4">{hero.description}</p>

              {/* Instant Search Bar */}
              <form onSubmit={handleHeroSearch} className="mb-4">
                <div
                  className="bg-white p-2 rounded-pill shadow-sm border d-flex align-items-center gap-2"
                  style={{ maxWidth: "520px" }}
                >
                  <div className="ps-3 text-danger fs-5">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none px-2 text-white"
                    placeholder="Search cakes, jollof, small chops, soups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: "15px", background: "transparent" }}
                  />
                  <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4 py-2">
                    Search Menu
                  </button>
                </div>
              </form>

              {/* Quick Actions */}
              <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
                <Link to="/shop" className="btn btn-glozzy-primary shadow-sm">
                  <i className="fa-solid fa-utensils me-2"></i>
                  Full Menu Catalogue
                </Link>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    "Hello GlozzyFoods, I want to place an order."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glozzy-whatsapp shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp me-2"></i> Order on WhatsApp
                </a>
              </div>

              {/* Service micro-tags */}
              <div className="d-flex align-items-center gap-4 pt-3 border-top flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-check text-success"></i>
                  <span className="small fw-semibold text-dark">Freshly Cooked</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-bolt text-warning"></i>
                  <span className="small fw-semibold text-dark">Fast Dispatch</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-star text-warning"></i>
                  <span className="small fw-semibold text-dark">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image Box with Dark Glass Floating Chips */}
            <div className="col-lg-6">
              <div className="glozzy-hero-img-box position-relative">
                <img
                  src={
                    hero.bannerImage ||
                    "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt="GlozzyFoods Delicacies"
                  className="glozzy-hero-main-img shadow-lg"
                />

                {/* Floating Chip 1: Speed */}
                <div
                  className="position-absolute top-0 end-0 m-3 p-3 rounded-4 shadow-lg d-none d-sm-flex align-items-center gap-3"
                  style={{
                    background: "rgba(28,28,28,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--g-border)",
                    transform: "translateY(-10px)",
                  }}
                >
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px", fontSize: "18px" }}
                  >
                    <i className="fa-solid fa-motorcycle"></i>
                  </div>
                  <div>
                    <strong className="d-block text-dark small">Fast Delivery</strong>
                    <small className="text-muted">Benin Citywide</small>
                  </div>
                </div>

                {/* Floating Chip 2: Quality */}
                <div
                  className="position-absolute bottom-0 start-0 m-3 p-3 rounded-4 shadow-lg d-none d-sm-flex align-items-center gap-3"
                  style={{
                    background: "rgba(28,28,28,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--g-border)",
                    transform: "translateY(10px)",
                  }}
                >
                  <div
                    className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center"
                    style={{ width: "42px", height: "42px", fontSize: "18px" }}
                  >
                    <i className="fa-solid fa-heart text-danger"></i>
                  </div>
                  <div>
                    <strong className="d-block text-dark small">100% Homemade Taste</strong>
                    <small className="text-muted">Over 1,000+ Happy Foodies</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY ROW */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-danger fw-bold small text-uppercase">Categories</span>
              <h3 className="fw-bold text-dark mb-0">What are you craving?</h3>
            </div>
            <Link to="/shop" className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold">
              View All Menu &rarr;
            </Link>
          </div>

          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {categories
              .filter((c) => c.active)
              .map((cat) => (
                <div className="col" key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="glozzy-category-card text-center text-decoration-none">
                    <div className="glozzy-cat-icon-wrap mb-2">
                      <img src={cat.image} alt={cat.name} loading="lazy" />
                    </div>
                    <h5 className="glozzy-cat-name mb-0">{cat.name}</h5>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold mb-2">
                Popular in Benin City
              </span>
              <h2 className="fw-bold text-dark mb-0">Top Customer Favourites</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 border ${
                  selectedCategoryTab === "all" ? "btn-danger fw-bold" : "btn-white bg-white text-dark"
                }`}
                onClick={() => setSelectedCategoryTab("all")}
              >
                ⭐ All
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-2 border ${
                    selectedCategoryTab === cat.id ? "btn-danger fw-bold" : "btn-white bg-white text-dark"
                  }`}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
            {filteredProducts.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/shop" className="btn btn-glozzy-primary btn-lg px-5 shadow-sm">
              Explore Full Menu ({products.length}+ Items) &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PROMO BANNER */}
      <section className="py-4">
        <div className="container">
          <div
            className="card bg-dark text-white rounded-4 overflow-hidden shadow-lg position-relative border"
            style={{ borderColor: "var(--g-accent)" }}
          >
            <div className="row g-0 align-items-center">
              <div className="col-lg-7 p-4 p-md-5">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-3">
                  🔥 Special Discount
                </span>
                <h3 className="fw-bold text-white mb-2" style={{ fontSize: "28px" }}>
                  {cms?.promoBanner?.title || "Get 10% Discount on Orders Above ₦15,000!"}
                </h3>
                <p className="text-white-50 mb-4" style={{ fontSize: "14px", maxWidth: "500px" }}>
                  {cms?.promoBanner?.subtitle ||
                    "Use coupon code GLOZZY10 at checkout or mention it when ordering directly on WhatsApp."}
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div
                    className="fw-bold px-4 py-2 rounded-pill font-monospace fs-5 border"
                    style={{
                      background: "var(--g-bg-elevated)",
                      color: "var(--g-accent)",
                      borderColor: "var(--g-accent)",
                    }}
                  >
                    CODE: {cms?.promoBanner?.code || "GLOZZY10"}
                  </div>
                  <Link to="/shop" className="btn btn-glozzy-primary px-4 py-2">
                    Order With Discount
                  </Link>
                </div>
              </div>
              <div className="col-lg-5 d-none d-lg-block">
                <img
                  src={
                    cms?.promoBanner?.image ||
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Party Food Promo"
                  className="w-100 h-100 object-fit-cover"
                  style={{ minHeight: "280px", maxHeight: "320px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VALUE PROPOSITION */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-danger fw-bold small text-uppercase">Why GlozzyFoods</span>
            <h3 className="fw-bold text-dark mt-1">Food delivery made simple</h3>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "56px", height: "56px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-kitchen-set"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2">Fresh Handcrafted</h6>
                <p className="text-muted small mb-0">
                  Every dish, cake, and pastry is made fresh to order.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "56px", height: "56px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2">Swift Delivery</h6>
                <p className="text-muted small mb-0">
                  Doorstep food delivery right across Benin City.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "56px", height: "56px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-cake-candles"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2">Event Catering</h6>
                <p className="text-muted small mb-0">
                  Custom celebration cakes and party food platters.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "56px", height: "56px", fontSize: "22px" }}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2">Instant WhatsApp Orders</h6>
                <p className="text-muted small mb-0">
                  Order and chat with our kitchen with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CATERING CTA BANNER */}
      <section className="py-5 bg-danger text-white text-center">
        <div className="container py-2">
          <h3 className="fw-bold text-white mb-2">
            Planning a Wedding, Birthday or Event?
          </h3>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: "550px", fontSize: "15px" }}>
            Let GlozzyFoods handle your catering! Multi-tier cakes, small chops platters, and authentic Nigerian food buffets.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/catering" className="btn btn-dark fw-bold btn-lg px-4 rounded-pill shadow-sm">
              <i className="fa-solid fa-calendar-check me-2"></i>
              Event Catering Details
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                "Hello GlozzyFoods, I would like to inquire about event catering services."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg px-4 rounded-pill"
            >
              <i className="fa-brands fa-whatsapp me-2"></i>
              Chat With Our Chef
            </a>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        show={!!quickViewProduct}
        onHide={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </>
  );
};

export default HomePage;
