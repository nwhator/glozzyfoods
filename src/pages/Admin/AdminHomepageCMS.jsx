import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

const AdminHomepageCMS = () => {
  const { cms, updateCMS } = useStore();

  const [heroTagline, setHeroTagline] = useState(cms?.hero?.tagline || "");
  const [heroTitle, setHeroTitle] = useState(cms?.hero?.title || "");
  const [heroHighlight, setHeroHighlight] = useState(cms?.hero?.highlightText || "");
  const [heroDesc, setHeroDesc] = useState(cms?.hero?.description || "");
  const [heroPrimaryCta, setHeroPrimaryCta] = useState(cms?.hero?.primaryCtaText || "");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState(cms?.hero?.secondaryCtaText || "");
  const [heroBannerImage, setHeroBannerImage] = useState(cms?.hero?.bannerImage || "");

  const [topbarNotice, setTopbarNotice] = useState(cms?.topbarNotice || "");

  const [promoTitle, setPromoTitle] = useState(cms?.promoBanner?.title || "");
  const [promoCode, setPromoCode] = useState(cms?.promoBanner?.code || "");
  const [promoSubtitle, setPromoSubtitle] = useState(cms?.promoBanner?.subtitle || "");
  const [promoImage, setPromoImage] = useState(cms?.promoBanner?.image || "");

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveCMS = (e) => {
    e.preventDefault();
    updateCMS({
      hero: {
        tagline: heroTagline.trim(),
        title: heroTitle.trim(),
        highlightText: heroHighlight.trim(),
        description: heroDesc.trim(),
        primaryCtaText: heroPrimaryCta.trim(),
        secondaryCtaText: heroSecondaryCta.trim(),
        bannerImage: heroBannerImage.trim(),
      },
      topbarNotice: topbarNotice.trim(),
      promoBanner: {
        title: promoTitle.trim(),
        code: promoCode.trim(),
        subtitle: promoSubtitle.trim(),
        image: promoImage.trim(),
      },
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Homepage Content Management (CMS)</h2>
          <p className="text-muted small mb-0">
            Update hero headlines, promotional banners, and announcement texts without touching code.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-danger rounded-pill px-3"
        >
          <i className="fa-solid fa-eye me-1"></i> Preview Live Storefront
        </a>
      </div>

      {savedToast && (
        <div className="alert alert-success rounded-4 py-2 px-3 small mb-4 shadow-sm">
          <i className="fa-solid fa-circle-check me-2"></i>
          Homepage content updated successfully! Check the live customer website to see your changes.
        </div>
      )}

      <form onSubmit={handleSaveCMS}>
        {/* 1. TOP ANNOUNCEMENT NOTICE */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h5 className="fw-bold text-dark mb-3">
            <i className="fa-solid fa-bullhorn text-danger me-2"></i> Top Announcement Bar
          </h5>
          <div className="mb-2">
            <label className="form-label small fw-bold">Banner Alert Text</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={topbarNotice}
              onChange={(e) => setTopbarNotice(e.target.value)}
              placeholder="e.g. 🔥 Fast delivery in Benin City! Call/WhatsApp: +234 703 551 8331"
            />
          </div>
        </div>

        {/* 2. HERO SECTION CMS */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h5 className="fw-bold text-dark mb-3">
            <i className="fa-solid fa-image text-danger me-2"></i> Hero Banner Section
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Hero Tagline / Badge</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Hero Highlight Brand Text</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={heroHighlight}
                onChange={(e) => setHeroHighlight(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Hero Main Headline Title</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Hero Supporting Subtitle</label>
              <textarea
                className="form-control rounded-3"
                rows="2"
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Primary Button Text</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={heroPrimaryCta}
                onChange={(e) => setHeroPrimaryCta(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Secondary Button Text</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={heroSecondaryCta}
                onChange={(e) => setHeroSecondaryCta(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Hero Food Banner Image URL</label>
              <input
                type="url"
                className="form-control rounded-3"
                value={heroBannerImage}
                onChange={(e) => setHeroBannerImage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. PROMOTIONAL CARD CMS */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h5 className="fw-bold text-dark mb-3">
            <i className="fa-solid fa-percent text-danger me-2"></i> Promotional Discount Banner
          </h5>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label small fw-bold">Promo Card Title</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Featured Promo Code</label>
              <input
                type="text"
                className="form-control text-uppercase rounded-3 font-monospace"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Promo Subtitle / Instructions</label>
              <textarea
                className="form-control rounded-3"
                rows="2"
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
              ></textarea>
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Promo Banner Image URL</label>
              <input
                type="url"
                className="form-control rounded-3"
                value={promoImage}
                onChange={(e) => setPromoImage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-glozzy-primary btn-lg rounded-pill px-5 shadow-sm">
            <i className="fa-solid fa-floppy-disk me-2"></i> Save Homepage Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHomepageCMS;
