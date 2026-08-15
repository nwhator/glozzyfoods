import React from "react";
import { Link } from "react-router-dom";

export const PrivacyPolicyPage = () => {
  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 className="fw-bold text-dark mb-4">Privacy Policy</h1>
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white small text-muted" style={{ lineHeight: "1.8" }}>
          <h5 className="fw-bold text-dark">1. Information We Collect</h5>
          <p>
            When you place an order on GlozzyFoods ND More, we collect your name, email address, phone number (for WhatsApp updates and rider dispatch), and delivery address.
          </p>

          <h5 className="fw-bold text-dark mt-4">2. How We Use Your Information</h5>
          <p>
            Your information is used strictly to fulfill food delivery orders, send order status alerts, process payments via secure gateways like Paystack, and notify you of special promos if you opted in.
          </p>

          <h5 className="fw-bold text-dark mt-4">3. Payment Security</h5>
          <p>
            We do not store your debit card numbers or bank PINs on our servers. All digital transactions are processed through encrypted, PCI-DSS compliant payment providers (such as Paystack).
          </p>

          <h5 className="fw-bold text-dark mt-4">4. Contact Us</h5>
          <p className="mb-0">
            For questions about your data privacy, contact our support team at <strong className="text-dark">orders@glozzyfoods.com</strong> or call <strong className="text-dark">+234 703 551 8331</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 className="fw-bold text-dark mb-4">Terms & Conditions</h1>
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white small text-muted" style={{ lineHeight: "1.8" }}>
          <h5 className="fw-bold text-dark">1. Order Placement & Cancellation</h5>
          <p>
            Because food items are freshly prepared upon request, orders cannot be cancelled once cooking has commenced ("Preparing" stage). Please verify your order items, delivery zone, and contact numbers before finalizing checkout.
          </p>

          <h5 className="fw-bold text-dark mt-4">2. Delivery Timeframes</h5>
          <p>
            Estimated delivery times (25 to 55 minutes) are provided in good faith and may vary during adverse weather or unexpected heavy traffic conditions in Benin City. Our dispatch riders prioritize delivering your meals fresh and hot.
          </p>

          <h5 className="fw-bold text-dark mt-4">3. Custom Cake Inscriptions</h5>
          <p>
            All custom inscriptions and cake decoration instructions provided in the checkout notes are followed diligently. Please ensure proper spelling before submitting.
          </p>

          <h5 className="fw-bold text-dark mt-4">4. Event Catering Deposits</h5>
          <p className="mb-0">
            Catering bookings for weddings and large events require a confirmed deposit to reserve the date and begin ingredient procurement.
          </p>
        </div>
      </div>
    </div>
  );
};
