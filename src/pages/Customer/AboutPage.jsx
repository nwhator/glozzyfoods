import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const AboutPage = () => {
  const { cms } = useStore();
  const phone = cms?.storeContact?.phone || "+234 703 551 8331";
  const whatsapp = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <div className="py-5">
      <div className="container">
        {/* HERO BANNER */}
        <div className="card bg-danger text-white border-0 rounded-4 overflow-hidden shadow-lg mb-5">
          <div className="p-4 p-md-5 text-center" style={{ maxWidth: "760px", margin: "0 auto" }}>
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">
              The GlozzyFoods Story
            </span>
            <h1 className="fw-bold display-5 mb-3">
              Great Food. Great Taste. Every Time.
            </h1>
            <p className="text-white-50 fs-6 mb-0" style={{ lineHeight: "1.8" }}>
              Born from a deep love for rich Nigerian culinary heritage and artisan confectionery, <strong className="text-white">GlozzyFoods ND More</strong> delivers homemade perfection across African soups, celebration cakes, small chops, and refreshing treats.
            </p>
          </div>
        </div>

        {/* STORY & MISSION SECTION */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                alt="Cooking with care"
                className="rounded-4 shadow-lg w-100 object-fit-cover border"
                style={{ maxHeight: "420px" }}
              />
              <div
                className="position-absolute bottom-0 start-0 m-3 p-3 bg-white rounded-4 shadow-lg border"
                style={{ maxWidth: "270px", borderLeft: "3px solid var(--g-accent)" }}
              >
                <strong className="text-dark d-block">Handcrafted Fresh Daily</strong>
                <small className="text-muted">No shortcuts. Pure authentic taste.</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <h3 className="fw-bold text-dark mb-3">Our Mission & Culinary Philosophy</h3>
            <p className="text-muted" style={{ lineHeight: "1.7" }}>
              At GlozzyFoods ND More, we believe that good food brings families, friends, and communities together. Whether you are craving the deep, rich flavours of authentic Delta Banga or Egusi soup, treating yourself to a creamy layered fruit parfait, enjoying crunchy VIP small chops, or celebrating life with our decadent Red Velvet cakes — every single dish is prepared with meticulous hygiene and love.
            </p>
            <p className="text-muted" style={{ lineHeight: "1.7" }}>
              We source the freshest local vegetables, farm produce, and premium baking ingredients so you get maximum taste, nutrient richness, and happiness with every single bite.
            </p>
            <div className="row g-3 mt-2">
              <div className="col-sm-6">
                <div
                  className="p-3 bg-white rounded-4 border shadow-sm"
                  style={{ borderLeft: "3px solid var(--g-accent)" }}
                >
                  <h5 className="fw-bold text-danger mb-1">100% Homemade</h5>
                  <small className="text-muted">Authentic recipes passed down through generations.</small>
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="p-3 bg-white rounded-4 border shadow-sm"
                  style={{ borderLeft: "3px solid var(--g-accent)" }}
                >
                  <h5 className="fw-bold text-danger mb-1">Fast & Reliable</h5>
                  <small className="text-muted">Direct doorstep delivery right across Benin City.</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VALUES */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
          <h3 className="fw-bold text-dark text-center mb-5">What Drives GlozzyFoods</h3>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "60px", height: "60px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-heart"></i>
                </div>
                <h5 className="fw-bold text-dark">Passion for Quality</h5>
                <p className="text-muted small">We never compromise on the quality of ingredients, spices, or butter in our confectionery.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "60px", height: "60px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </div>
                <h5 className="fw-bold text-dark">Customer Happiness</h5>
                <p className="text-muted small">Every customer is family. We tailor our spice levels, cake inscriptions, and packaging to your exact wishes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div
                  className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                  style={{ width: "60px", height: "60px", fontSize: "22px" }}
                >
                  <i className="fa-solid fa-champagne-glasses"></i>
                </div>
                <h5 className="fw-bold text-dark">Celebration Ready</h5>
                <p className="text-muted small">From intimate solo cravings to grand 500-guest wedding buffets, we cater with poise and excellence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="card bg-danger text-white rounded-4 p-4 p-md-5 text-center border-0 shadow-lg">
          <h3 className="fw-bold mb-2">Ready to Taste the GlozzyFoods Difference?</h3>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: "550px", fontSize: "15px" }}>
            Explore our mouthwatering dishes or contact our culinary team directly for custom orders.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/shop" className="btn btn-warning text-dark fw-bold btn-lg px-4 rounded-pill">
              Explore Our Menu
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg px-4 rounded-pill"
            >
              <i className="fa-brands fa-whatsapp me-2"></i> Chat with Us ({phone})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
