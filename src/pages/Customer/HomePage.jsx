import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import QuickViewModal from "../../components/Common/QuickViewModal";

const HomePage = () => {
  const { categories, products, cms, formatNaira } = useStore();
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

  // Filter featured dishes by category tab
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
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="glozzy-hero-tag">
                <i className="fa-solid fa-fire text-danger"></i>
                {hero.tagline}
              </div>
              <h1 className="glozzy-hero-title">
                {hero.title} <br />
                <span>{hero.highlightText}</span>
              </h1>
              <p className="glozzy-hero-desc">{hero.description}</p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Link to="/shop" className="btn btn-glozzy-primary btn-lg shadow-sm">
                  <i className="fa-solid fa-utensils me-2"></i>
                  {hero.primaryCtaText}
                </Link>
                <Link to="/catering" className="btn btn-glozzy-accent btn-lg shadow-sm">
                  <i className="fa-solid fa-cake-candles me-2"></i>
                  Event Catering
                </Link>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    "Hello GlozzyFoods, I want to place an order."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glozzy-whatsapp btn-lg"
                >
                  <i className="fa-brands fa-whatsapp me-1"></i> Quick WhatsApp
                </a>
              </div>

              {/* Service micro-tags */}
              <div className="d-flex align-items-center gap-4 mt-4 pt-3 border-top border-light">
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-check text-success fs-5"></i>
                  <span className="small fw-semibold text-dark">Freshly Cooked</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-truck-fast text-danger fs-5"></i>
                  <span className="small fw-semibold text-dark">Speedy Delivery</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-star text-warning fs-5"></i>
                  <span className="small fw-semibold text-dark">5-Star Quality</span>
                </div>
              </div>
            </div>

            {/* Hero Image Box */}
            <div className="col-lg-6">
              <div className="glozzy-hero-img-box">
                <img
                  src={
                    hero.bannerImage ||
                    "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt="GlozzyFoods Delicacies"
                  className="glozzy-hero-main-img"
                />
                <div className="glozzy-hero-floating-card">
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 text-danger p-3 d-flex align-items-center justify-content-center"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="fa-solid fa-bell-concierge fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Same-Day Ordering</h6>
                    <small className="text-muted">Fresh & hot to your door</small>
                  </div>
                </div>
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
              <span className="text-danger fw-bold small text-uppercase letter-spacing-1">Explore Menu</span>
              <h2 className="fw-bold text-dark mb-0">Browse By Category</h2>
            </div>
            <Link to="/shop" className="btn btn-outline-danger btn-sm rounded-pill px-3">
              View All Categories <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
            {categories
              .filter((c) => c.active)
              .map((cat) => (
                <div className="col" key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="glozzy-category-card">
                    <div className="glozzy-cat-icon-wrap">
                      <img src={cat.image} alt={cat.name} loading="lazy" />
                    </div>
                    <h4 className="glozzy-cat-name">{cat.name}</h4>
                    <p className="glozzy-cat-desc mb-0">{cat.description}</p>
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
            <h2 className="fw-bold text-dark">Delicious Dishes & Sweet Treats</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: "500px" }}>
              Handmade from scratch with fresh local and premium ingredients. Select your favourite treat below.
            </p>

            {/* Category Filter Tabs */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
              <button
                type="button"
                className={`btn btn-sm ${
                  selectedCategoryTab === "all" ? "btn-danger fw-bold" : "btn-white bg-white text-dark"
                } rounded-pill px-3 py-2 shadow-sm border`}
                onClick={() => setSelectedCategoryTab("all")}
              >
                ⭐ All Favourites
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${
                    selectedCategoryTab === cat.id ? "btn-danger fw-bold" : "btn-white bg-white text-dark"
                  } rounded-pill px-3 py-2 shadow-sm border`}
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
              View Full Menu Catalogue ({products.length}+ Items) &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SPECIAL PROMO BANNER */}
      <section className="py-5">
        <div className="container">
          <div className="card bg-dark text-white rounded-4 overflow-hidden border-0 shadow-lg position-relative">
            <div className="row g-0 align-items-center">
              <div className="col-lg-7 p-4 p-md-5">
                <span className="badge bg-warning text-dark fw-bold px-3 py-2 mb-3">
                  🔥 Special Celebration Offer
                </span>
                <h2 className="fw-bold text-white mb-3" style={{ fontSize: "32px" }}>
                  {cms?.promoBanner?.title || "Get 10% Discount on Orders Above ₦15,000!"}
                </h2>
                <p className="text-white-50 mb-4" style={{ fontSize: "15px", maxWidth: "500px" }}>
                  {cms?.promoBanner?.subtitle ||
                    "Use coupon code GLOZZY10 at checkout or mention it when placing your order directly on WhatsApp."}
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="bg-white text-danger fw-bold px-4 py-2 rounded-pill font-monospace fs-5">
                    CODE: {cms?.promoBanner?.code || "GLOZZY10"}
                  </div>
                  <Link to="/shop" className="btn btn-glozzy-accent px-4 py-2">
                    Claim Discount Now
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
                  style={{ minHeight: "320px", maxHeight: "380px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE GLOZZYFOODS (SERVICES) */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-danger fw-bold small text-uppercase">The GlozzyFoods Standard</span>
            <h2 className="fw-bold text-dark">Why Our Customers Love Us</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all hover-shadow">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px", fontSize: "24px" }}
                >
                  <i className="fa-solid fa-kitchen-set"></i>
                </div>
                <h5 className="fw-bold text-dark">Fresh Handcrafted</h5>
                <p className="text-muted small mb-0">
                  Every pastry, cake, and African dish is freshly prepared with traditional homemade care.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all hover-shadow">
                <div
                  className="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px", fontSize: "24px" }}
                >
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <h5 className="fw-bold text-dark">Swift Delivery</h5>
                <p className="text-muted small mb-0">
                  Speedy, well-packaged doorstep delivery right across Benin City to preserve hot food quality.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all hover-shadow">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px", fontSize: "24px" }}
                >
                  <i className="fa-solid fa-cake-candles"></i>
                </div>
                <h5 className="fw-bold text-dark">Event Catering</h5>
                <p className="text-muted small mb-0">
                  Full catering packages for birthdays, weddings, corporate events, and custom celebration cakes.
                </p>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="p-4 rounded-4 bg-light h-100 border transition-all hover-shadow">
                <div
                  className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px", fontSize: "24px" }}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <h5 className="fw-bold text-dark">Easy WhatsApp Orders</h5>
                <p className="text-muted small mb-0">
                  Instant ordering and live updates via WhatsApp for ultimate convenience and personalization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-danger fw-bold small text-uppercase">Customer Love</span>
            <h2 className="fw-bold text-dark">What Food Lovers Say About Us</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="d-flex text-warning mb-3">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: "1.6" }}>
                  "The Red Velvet Cake was so moist and rich! Everyone at my daughter's birthday kept asking where we bought it. GlozzyFoods is now our family bakery."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-danger text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    BE
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Blessing Enoma</h6>
                    <small className="text-muted">GRA, Benin City</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="d-flex text-warning mb-3">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: "1.6" }}>
                  "Best small chops platter hands down! The samosas were packed with meat and the spring rolls stayed crunchy even after delivery. 10/10 service!"
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    KA
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Kenneth Adeleke</h6>
                    <small className="text-muted">Airport Road, Benin City</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div className="d-flex text-warning mb-3">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-muted small mb-4" style={{ lineHeight: "1.6" }}>
                  "Their fruit parfait and natural spiced zobo drink are my weekly obsession. Healthy, super fresh, and very rich. Highly recommend to everyone."
                </p>
                <div className="d-flex align-items-center gap-3 mt-auto">
                  <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    EO
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Eunice O.</h6>
                    <small className="text-muted">Ugbowo, Benin City</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CATERING CTA BANNER */}
      <section className="py-5 bg-danger text-white text-center">
        <div className="container py-3">
          <h2 className="fw-bold mb-3" style={{ fontSize: "34px" }}>
            Planning a Wedding, Birthday or Corporate Event?
          </h2>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: "600px", fontSize: "16px" }}>
            Let GlozzyFoods handle your event catering! From custom multi-tier celebration cakes and VIP small chops platters to rich African soup buffets.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/catering" className="btn btn-warning text-dark fw-bold btn-lg px-4 rounded-pill">
              <i className="fa-solid fa-calendar-check me-2"></i>
              Plan Your Event With Us
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
              Chat With Our Event Chef
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
