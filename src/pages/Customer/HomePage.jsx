import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import QuickViewModal from "../../components/Common/QuickViewModal";

const HomePage = () => {
  const { categories, products, cms } = useStore();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const hero = cms?.hero || {
    tagline: "Authentic Nigerian Dishes & Handcrafted Confectioneries",
    title: "Great Food. Great Taste. Every Time.",
    highlightText: "GlozzyFoods ND More",
    description:
      "Fresh African dishes, delicious confectionery cakes, crispy small chops, refreshing chilled drinks and artisan fruit parfaits made with care in Benin City.",
    primaryCtaText: "Order Online Now",
    secondaryCtaText: "Explore Full Menu",
    bannerImage:
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80",
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
              <div className="glozzy-hero-tag mb-3">
                <i className="fa-solid fa-fire text-danger"></i>
                <span>{hero.tagline}</span>
              </div>
              <h1 className="glozzy-hero-title mb-3">
                {hero.title} <br />
                <span className="text-danger">{hero.highlightText}</span>
              </h1>
              <p className="glozzy-hero-desc mb-4">{hero.description}</p>
              <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
                <Link to="/shop" className="btn btn-glozzy-primary btn-lg shadow-sm">
                  <i className="fa-solid fa-utensils me-2"></i>
                  {hero.primaryCtaText}
                </Link>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    "Hello GlozzyFoods, I want to place an order."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glozzy-whatsapp btn-lg shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp me-2"></i> Quick WhatsApp
                </a>
              </div>

              {/* Service micro-tags */}
              <div className="d-flex align-items-center gap-4 pt-3 border-top border-secondary border-opacity-10 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-check text-success"></i>
                  <span className="small fw-semibold text-dark">Freshly Cooked</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-truck-fast text-danger"></i>
                  <span className="small fw-semibold text-dark">Fast Delivery in Benin</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-star text-warning"></i>
                  <span className="small fw-semibold text-dark">Top Quality</span>
                </div>
              </div>
            </div>

            {/* Hero Image Box */}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-danger fw-bold small text-uppercase">Explore Menu</span>
              <h3 className="fw-bold text-dark mb-0">Browse By Category</h3>
            </div>
            <Link to="/shop" className="btn btn-outline-danger btn-sm rounded-pill px-3">
              View All <i className="fa-solid fa-arrow-right ms-1"></i>
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

      {/* 3. FEATURED PRODUCTS SECTION (CUSTOMER FAVOURITES) */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 fw-bold mb-2">
              Top Customer Favourites
            </span>
            <h2 className="fw-bold text-dark">Popular Dishes & Treats</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: "500px" }}>
              Freshly prepared upon order with authentic recipes and high quality ingredients.
            </p>

            {/* Category Filter Tabs */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 border shadow-sm ${
                  selectedCategoryTab === "all" ? "btn-danger fw-bold" : "btn-white bg-white text-dark"
                }`}
                onClick={() => setSelectedCategoryTab("all")}
              >
                ⭐ All
              </button>
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-2 border shadow-sm ${
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
              View Full Menu ({products.length}+ Items) &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SPECIAL PROMO BANNER */}
      <section className="py-4">
        <div className="container">
          <div className="card bg-dark text-white rounded-4 overflow-hidden border-0 shadow-lg position-relative">
            <div className="row g-0 align-items-center">
              <div className="col-lg-7 p-4 p-md-5">
                <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-3">
                  🔥 Special Offer
                </span>
                <h3 className="fw-bold text-white mb-2" style={{ fontSize: "28px" }}>
                  {cms?.promoBanner?.title || "Get 10% Discount on Orders Above ₦15,000!"}
                </h3>
                <p className="text-white-50 mb-4" style={{ fontSize: "14px", maxWidth: "500px" }}>
                  {cms?.promoBanner?.subtitle ||
                    "Use coupon code GLOZZY10 at checkout or mention it when ordering directly on WhatsApp."}
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="bg-white text-danger fw-bold px-4 py-2 rounded-pill font-monospace fs-5">
                    CODE: {cms?.promoBanner?.code || "GLOZZY10"}
                  </div>
                  <Link to="/shop" className="btn btn-glozzy-accent px-4 py-2">
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

      {/* 5. WHY CHOOSE GLOZZYFOODS (SERVICES) */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-danger fw-bold small text-uppercase">Why GlozzyFoods</span>
            <h3 className="fw-bold text-dark">The GlozzyFoods Standard</h3>
          </div>

          <div className="row g-3 text-center">
            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "52px", height: "52px", fontSize: "20px" }}
                >
                  <i className="fa-solid fa-kitchen-set"></i>
                </div>
                <h6 className="fw-bold text-dark">Fresh Handcrafted</h6>
                <p className="text-muted small mb-0">
                  Every dish, cake, and pastry is prepared fresh with quality ingredients.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all">
                <div
                  className="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "52px", height: "52px", fontSize: "20px" }}
                >
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h6 className="fw-bold text-dark">Swift Delivery</h6>
                <p className="text-muted small mb-0">
                  Speedy, well-packaged doorstep delivery across Benin City.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "52px", height: "52px", fontSize: "20px" }}
                >
                  <i className="fa-solid fa-cake-candles"></i>
                </div>
                <h6 className="fw-bold text-dark">Event Catering</h6>
                <p className="text-muted small mb-0">
                  Custom cakes and catering platters for birthdays, weddings, and events.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "52px", height: "52px", fontSize: "20px" }}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <h6 className="fw-bold text-dark">WhatsApp Ordering</h6>
                <p className="text-muted small mb-0">
                  Instant ordering and live order support directly via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CATERING CTA BANNER */}
      <section className="py-5 bg-danger text-white text-center">
        <div className="container py-2">
          <h3 className="fw-bold mb-2">
            Planning an Event or Celebration?
          </h3>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: "550px", fontSize: "15px" }}>
            Let GlozzyFoods handle your catering! Multi-tier cakes, small chops platters, and authentic Nigerian food buffets.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/catering" className="btn btn-warning text-dark fw-bold btn-lg px-4 rounded-pill">
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
