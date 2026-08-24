import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

const CATERING_PACKAGES = [
  {
    id: "pkg-small-chops",
    name: "VIP Small Chops Mega Party Pack",
    pricePerGuest: 1800,
    minGuests: 25,
    description:
      "Includes hot crispy spring rolls, spiced meat samosas, sweet puff puff, plantain mosa, peppered chicken skewers, and dipping sauces.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    features: [
      "5 Pieces per guest",
      "Fried fresh on-site or delivered in heated chaffing trays",
      "Includes serviettes and branded toothpick flags",
      "Special spicy dip & sweet sauce",
    ],
  },
  {
    id: "pkg-jollof-feast",
    name: "Smoky Party Jollof & African Dishes Buffet",
    pricePerGuest: 3200,
    minGuests: 20,
    description:
      "Authentic firewood party Jollof rice, Fried rice, sweet plantain (dodo), fresh coleslaw, and grilled quarter chicken / peppered beef.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    features: [
      "Jollof Rice + Fried Rice combo",
      "Peppered Chicken, Beef or Fish protein",
      "Sweet Fried Plantain (Dodo)",
      "Creamy Coleslaw salad",
      "Disposable premium cutlery & takeaway packs",
    ],
  },
  {
    id: "pkg-traditional-soup",
    name: "Traditional Soups & Swallows Station",
    pricePerGuest: 4500,
    minGuests: 30,
    description:
      "Rich Nigerian soups (Special Egusi, Delta Banga, Seafood Okro) with Pounded Yam / Semovita, assorted meats, stockfish and dried catfish.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    features: [
      "Choice of 2 Signature Soups (Egusi / Banga / Seafood Okro)",
      "Assorted Meat, Shaki, Kpomo, & Smoked Catfish",
      "Hot Pounded Yam / Semo wraps",
      "Traditional serving station setup",
    ],
  },
  {
    id: "pkg-celebration-cake",
    name: "Custom Multi-Tier Celebration & Wedding Cakes",
    pricePerGuest: 2200,
    minGuests: 50,
    description:
      "Handcrafted multi-tier wedding and birthday cakes tailored to your colour palette and themes with rich fruit cake, red velvet, and chocolate fudge layers.",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80",
    features: [
      "Custom multi-tier structure & fondant finish",
      "Cake tasting session for the couple/host",
      "Free delivery and on-site cake setup in Benin City",
      "Complimentary matching anniversary keepsake box",
    ],
  },
];

const CateringPage = () => {
  const { formatNaira, cms } = useStore();

  const [guestCount, setGuestCount] = useState(50);
  const [selectedPkgId, setSelectedPkgId] = useState("pkg-small-chops");
  const [includeDrinks, setIncludeDrinks] = useState(true);
  const [includeCustomCake, setIncludeCustomCake] = useState(false);
  const [hostName, setHostName] = useState("");
  const [hostPhone, setHostPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("Birthday Party");
  const [eventNotes, setEventNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedPkg = CATERING_PACKAGES.find((p) => p.id === selectedPkgId) || CATERING_PACKAGES[0];

  // Live calculation
  const baseFoodCost = selectedPkg.pricePerGuest * guestCount;
  const drinksCost = includeDrinks ? guestCount * 600 : 0;
  const cakeCost = includeCustomCake ? 35000 : 0;
  const estimatedTotal = baseFoodCost + drinksCost + cakeCost;

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappInquiryUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello GlozzyFoods, I would like a catering quote for my event:\n` +
      `- Event: ${eventType}\n` +
      `- Date: ${eventDate || "Upcoming"}\n` +
      `- Guests: ${guestCount} people\n` +
      `- Package: ${selectedPkg.name}\n` +
      `- Drinks Included: ${includeDrinks ? "Yes (Zobo/Chapman)" : "No"}\n` +
      `- Custom Cake Included: ${includeCustomCake ? "Yes" : "No"}\n` +
      `- Estimated Budget: ${formatNaira(estimatedTotal)}\n` +
      `- Host: ${hostName} (${hostPhone})\n` +
      `- Notes: ${eventNotes || "None"}`
  )}`;

  return (
    <div className="py-5">
      <div className="container">
        {/* HERO BANNER - DARK GRADIENT */}
        <div
          className="card text-white border-0 rounded-4 overflow-hidden shadow-lg mb-5"
          style={{
            background: "linear-gradient(135deg, var(--g-bg-card) 0%, var(--g-bg-elevated) 100%)",
            border: "1px solid var(--g-border)",
          }}
        >
          <div className="row g-0 align-items-center">
            <div className="col-lg-7 p-4 p-md-5">
              <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 rounded-pill mb-3 border border-danger border-opacity-25">
                Events & Catering Services
              </span>
              <h1 className="fw-bold text-white mb-3" style={{ fontSize: "36px" }}>
                Make Your Event Unforgettable With GlozzyFoods Catering
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                From weddings, birthdays, and anniversaries to corporate lunches and intimate family feasts. We deliver authentic Nigerian dishes, crispy party small chops, and bespoke celebration cakes.
              </p>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <a href="#quote-calculator" className="btn btn-glozzy-primary rounded-pill px-4 py-2">
                  <i className="fa-solid fa-calculator me-2"></i> Calculate Catering Quote
                </a>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    "Hello GlozzyFoods, I want to talk to your head chef regarding an event."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glozzy-whatsapp rounded-pill px-4 py-2"
                >
                  <i className="fa-brands fa-whatsapp me-2"></i> Chat With Chef
                </a>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                alt="Event Catering Buffet"
                className="w-100 h-100 object-fit-cover"
                style={{ minHeight: "360px" }}
              />
            </div>
          </div>
        </div>

        {/* CATERING PACKAGES GRID */}
        <div className="text-center mb-5">
          <span className="text-danger fw-bold small text-uppercase">Tailored Event Menus</span>
          <h2 className="fw-bold text-dark">Our Popular Catering Packages</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "600px" }}>
            Select from our chef-crafted event packages or customize an exclusive menu for your celebration.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {CATERING_PACKAGES.map((pkg) => (
            <div className="col-lg-6" key={pkg.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="row g-0 h-100">
                  <div className="col-sm-5">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-100 h-100 object-fit-cover"
                      style={{ minHeight: "220px" }}
                    />
                  </div>
                  <div className="col-sm-7 p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1 small">
                        Min {pkg.minGuests} Guests
                      </span>
                      <span className="fw-bold text-danger fs-5">
                        {formatNaira(pkg.pricePerGuest)} <small className="text-muted fs-6">/ guest</small>
                      </span>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{pkg.name}</h5>
                    <p className="text-muted small mb-3" style={{ fontSize: "13px" }}>
                      {pkg.description}
                    </p>
                    <ul className="list-unstyled small text-muted mb-4 flex-grow-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="mb-1 d-flex align-items-center">
                          <i className="fa-solid fa-check text-success me-2 flex-shrink-0"></i>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#quote-calculator"
                      className="btn btn-outline-danger btn-sm rounded-pill mt-auto"
                      onClick={() => setSelectedPkgId(pkg.id)}
                    >
                      Choose this Package &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE QUOTE CALCULATOR & INQUIRY FORM */}
        <div id="quote-calculator" className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
          <div className="text-center mb-4">
            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2">
              Interactive Tool
            </span>
            <h2 className="fw-bold text-dark">Instant Catering Quote Estimator</h2>
            <p className="text-muted small">
              Customize your event specifications to view an instant live estimate, then lock in your date with our event team.
            </p>
          </div>

          <div className="row g-5">
            {/* CALCULATOR CONTROLS */}
            <div className="col-lg-6">
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">1. Configure Your Event</h5>

              {/* Guests Count Slider */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-bold text-dark mb-0">Expected Number of Guests:</label>
                  <span className="badge bg-danger fs-6 px-3 py-1 rounded-pill">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="20"
                  max="500"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: "11px" }}>
                  <span>20 Guests</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500+ Guests</span>
                </div>
              </div>

              {/* Package Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">Select Catering Package:</label>
                <div className="d-flex flex-column gap-2">
                  {CATERING_PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                        selectedPkgId === pkg.id ? "border-danger bg-danger bg-opacity-10" : "bg-dark"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="radio"
                          name="cateringPackage"
                          className="form-check-input mt-0"
                          checked={selectedPkgId === pkg.id}
                          onChange={() => setSelectedPkgId(pkg.id)}
                        />
                        <div>
                          <strong className="text-dark small d-block">{pkg.name}</strong>
                          <span className="text-muted" style={{ fontSize: "12px" }}>
                            {formatNaira(pkg.pricePerGuest)} per person
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">Optional Add-ons:</label>
                <div className="d-flex flex-column gap-2">
                  <label
                    className="p-3 rounded-3 border d-flex align-items-center justify-content-between bg-dark"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-0"
                        checked={includeDrinks}
                        onChange={(e) => setIncludeDrinks(e.target.checked)}
                      />
                      <div>
                        <strong className="text-dark small d-block">
                          Chilled Natural Zobo & Chapman Mocktail Bar
                        </strong>
                        <small className="text-muted">+₦600 per guest (Free cups & ice)</small>
                      </div>
                    </div>
                  </label>

                  <label
                    className="p-3 rounded-3 border d-flex align-items-center justify-content-between bg-dark"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-0"
                        checked={includeCustomCake}
                        onChange={(e) => setIncludeCustomCake(e.target.checked)}
                      />
                      <div>
                        <strong className="text-dark small d-block">
                          Centrepiece 2-Tier Celebration Cake
                        </strong>
                        <small className="text-muted">+₦35,000 flat</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Live Cost Breakdown Box */}
              <div className="p-4 rounded-4 bg-danger bg-opacity-10 border border-danger">
                <h6 className="fw-bold text-dark mb-3">Estimated Budget Breakdown:</h6>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Food ({guestCount} guests &times; {formatNaira(selectedPkg.pricePerGuest)}):</span>
                  <span className="fw-bold text-dark">{formatNaira(baseFoodCost)}</span>
                </div>
                {includeDrinks && (
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Drinks Bar ({guestCount} guests &times; ₦600):</span>
                    <span className="fw-bold text-dark">{formatNaira(drinksCost)}</span>
                  </div>
                )}
                {includeCustomCake && (
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Celebration Cake:</span>
                    <span className="fw-bold text-dark">{formatNaira(cakeCost)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center border-top border-danger border-opacity-25 pt-2 mt-2">
                  <span className="fw-bold text-dark fs-5">Estimated Total:</span>
                  <span className="fw-bold text-danger fs-3">{formatNaira(estimatedTotal)}</span>
                </div>
              </div>
            </div>

            {/* INQUIRY FORM */}
            <div className="col-lg-6">
              <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">2. Reserve / Inquire for Your Date</h5>

              {submitted ? (
                <div className="alert alert-success p-4 rounded-4 text-center">
                  <i className="fa-solid fa-circle-check fs-2 text-success mb-2 d-block"></i>
                  <h5 className="fw-bold">Inquiry Sent Successfully!</h5>
                  <p className="small mb-3">
                    Our lead catering coordinator will contact you at <strong>{hostPhone}</strong> shortly.
                  </p>
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glozzy-whatsapp w-100 rounded-pill"
                  >
                    <i className="fa-brands fa-whatsapp me-2"></i> Fast-Track on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Your Name / Organization *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Barrister Osasere"
                      required
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        placeholder="e.g. 08023456789"
                        required
                        value={hostPhone}
                        onChange={(e) => setHostPhone(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Event Type *</label>
                      <select
                        className="form-select rounded-3"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <option>Birthday Party</option>
                        <option>Wedding Reception / Traditional Marriage</option>
                        <option>Corporate Lunch / AGM</option>
                        <option>Anniversary / Family Gathering</option>
                        <option>Burial Ceremony</option>
                        <option>Other Special Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Proposed Event Date *</label>
                    <input
                      type="date"
                      className="form-control rounded-3"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Special Requests / Venue Location</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      placeholder="Venue location in Benin City, preferred serving style, dietary preferences..."
                      value={eventNotes}
                      onChange={(e) => setEventNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <button type="submit" className="btn btn-glozzy-primary btn-lg w-100 py-3 shadow-sm rounded-pill">
                      Submit Catering Inquiry
                    </button>
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-glozzy-whatsapp btn-lg w-100 py-3 rounded-pill"
                    >
                      <i className="fa-brands fa-whatsapp me-2"></i> Send Quote Directly on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="card bg-danger text-white rounded-4 p-4 p-md-5 text-center border-0 shadow-lg">
          <h3 className="fw-bold mb-2">Have Custom Catering Requirements?</h3>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: "550px", fontSize: "15px" }}>
            Speak directly with our head culinary planner to customize a bespoke menu for weddings, executive luncheons, or anniversary celebrations.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                "Hello GlozzyFoods Head Chef, I want to discuss a custom event catering menu."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-warning text-dark fw-bold btn-lg px-4 rounded-pill"
            >
              <i className="fa-brands fa-whatsapp me-2"></i> Chat with Head Chef
            </a>
            <a
              href="#quote-calculator"
              className="btn btn-outline-light btn-lg px-4 rounded-pill"
            >
              <i className="fa-solid fa-calculator me-2"></i> Recalculate Estimate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringPage;
