import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

const ContactPage = () => {
  const { cms } = useStore();
  const phone = cms?.storeContact?.phone || "+234 703 551 8331";
  const whatsapp = cms?.storeContact?.whatsapp || "2347035518331";
  const email = cms?.storeContact?.email || "orders@glozzyfoods.com";
  const address = cms?.storeContact?.address || "Benin City, Edo State, Nigeria";
  const hours = cms?.storeContact?.hours || "Mon - Sat: 8:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM";

  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const whatsappDirectUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hello GlozzyFoods, my name is ${name || "Customer"}. I am reaching out regarding: ${subject}.\nMessage: ${message || "Hello"}`
  )}`;

  return (
    <div className="py-5">
      <div className="container">
        {/* HEADER */}
        <div className="text-center mb-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            Get in Touch
          </span>
          <h1 className="fw-bold text-dark display-5 mb-2">We'd Love to Hear From You</h1>
          <p className="text-muted small">
            Have questions about an existing order, custom celebration cakes, or catering your next event? Reach out to our friendly team.
          </p>
        </div>

        <div className="row g-5">
          {/* CONTACT INFO CARDS */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              {/* WhatsApp Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 bg-white"
                style={{ borderLeft: "3px solid var(--g-accent)" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "50px", height: "50px", fontSize: "24px" }}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">WhatsApp Instant Chat</h6>
                    <p className="text-muted small mb-2">{phone}</p>
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-glozzy-whatsapp btn-sm rounded-pill px-3"
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Call Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 bg-white"
                style={{ borderLeft: "3px solid var(--g-accent)" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "50px", height: "50px", fontSize: "22px" }}
                  >
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Direct Phone Call</h6>
                    <p className="text-muted small mb-2">{phone}</p>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>

              {/* Location & Hours Card */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 bg-white"
                style={{ borderLeft: "3px solid var(--g-accent)" }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "45px", height: "45px", fontSize: "20px" }}
                  >
                    <i className="fa-solid fa-location-dot text-danger"></i>
                  </div>
                  <div>
                    <strong className="text-dark small d-block">Location & Service Area:</strong>
                    <span className="text-muted small">{address}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "45px", height: "45px", fontSize: "20px" }}
                  >
                    <i className="fa-solid fa-clock text-warning"></i>
                  </div>
                  <div>
                    <strong className="text-dark small d-block">Kitchen & Order Hours:</strong>
                    <span className="text-muted small">{hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4">Send Us a Direct Message</h4>

              {sent ? (
                <div className="alert alert-success p-4 rounded-4 text-center">
                  <i className="fa-solid fa-circle-check fs-2 text-success mb-2 d-block"></i>
                  <h5 className="fw-bold">Message Received!</h5>
                  <p className="small mb-3">Thank you {name}. We will get back to you promptly.</p>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glozzy-whatsapp rounded-pill"
                  >
                    <i className="fa-brands fa-whatsapp me-2"></i> Fast-Track on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Your Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Osasere"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        placeholder="e.g. 08023456789"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Subject</label>
                    <select
                      className="form-select rounded-3"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option>General Inquiry / Food Question</option>
                      <option>Event Catering Inquiry</option>
                      <option>Custom Celebration Cake Order</option>
                      <option>Feedback / Review</option>
                      <option>Partnership / Bulk Supply</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Your Message *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      placeholder="Type your message, order inquiry or questions here..."
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <button type="submit" className="btn btn-glozzy-primary btn-lg w-100 py-3 shadow-sm rounded-pill">
                      Send Message
                    </button>
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-glozzy-whatsapp btn-lg w-100 py-3 rounded-pill"
                    >
                      <i className="fa-brands fa-whatsapp me-2"></i> Send via WhatsApp Directly
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
