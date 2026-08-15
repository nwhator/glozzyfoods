import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const FAQS = [
  {
    q: "How fast is delivery in Benin City?",
    a: "Standard delivery typically takes 25 to 45 minutes depending on your zone (GRA, Airport Road, Ugbowo, Ikpoba Hill, etc.). We also offer Express Priority Delivery for ultra-urgent orders!",
  },
  {
    q: "Can I customize the flavor, size, and message on celebration cakes?",
    a: "Yes! We offer 6-inch, 8-inch, and 10-inch options in Red Velvet, Belgian Chocolate, and Vanilla. You can include your custom inscription during checkout notes or send it to our cake decorator on WhatsApp.",
  },
  {
    q: "How are your African soups packaged and delivered?",
    a: "Our authentic soups (Egusi, Banga, Afang, Seafood Okro) are delivered hot in 1-Litre, 2-Litre, and 3-Litre food-grade leakproof plastic containers with generous portions of assorted beef, stockfish, and smoked fish.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support instant online payment via Paystack (Debit cards, USSD, bank transfer), Direct Bank Transfer to our Zenith Bank company account, and Cash on Delivery / POS on arrival.",
  },
  {
    q: "Do you cater for weddings, birthdays, and corporate events?",
    a: "Yes! We specialize in VIP small chops trays, multi-tier wedding cakes, packed corporate lunch boxes, and full buffet setups. Visit our Catering & Events page to estimate your quote!",
  },
  {
    q: "How do I track my order status in real time?",
    a: "You can track your order at any moment on our 'Track Order' page by entering your order number (e.g. GF-849201) to see whether it is Received, In the Kitchen, Packaged, or With the Rider.",
  },
];

const FAQPage = () => {
  const { cms } = useStore();
  const [openIndex, setOpenIndex] = useState(0);

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-5">
          <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            Help & Answers
          </span>
          <h1 className="fw-bold text-dark display-5 mb-2">Frequently Asked Questions</h1>
          <p className="text-muted small">
            Everything you need to know about our ordering process, cake customisations, and delivery in Benin City.
          </p>
        </div>

        <div className="d-flex flex-column gap-3 mb-5">
          {FAQS.map((faq, idx) => (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white" key={idx}>
              <div
                className="p-4 cursor-pointer d-flex justify-content-between align-items-center"
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              >
                <h5 className="fw-bold text-dark mb-0 fs-6">{faq.q}</h5>
                <i
                  className={`fa-solid ${
                    openIndex === idx ? "fa-minus text-danger" : "fa-plus text-muted"
                  } fs-6`}
                ></i>
              </div>
              {openIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-muted small border-top" style={{ lineHeight: "1.7" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="card bg-danger text-white rounded-4 p-4 text-center border-0 shadow">
          <h4 className="fw-bold mb-2">Still Have Questions?</h4>
          <p className="text-white-50 small mb-4">
            Our friendly kitchen customer support is ready to assist you on WhatsApp.
          </p>
          <div>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-warning text-dark fw-bold rounded-pill px-4 py-2"
            >
              <i className="fa-brands fa-whatsapp me-2"></i> Chat with Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
