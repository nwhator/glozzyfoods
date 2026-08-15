import React from "react";
import { useStore } from "../../context/StoreContext";

const WhatsAppFloating = ({ customText }) => {
  const { cms } = useStore();
  const phone = cms?.storeContact?.whatsapp || "2347035518331";
  const defaultText = "Hello GlozzyFoods, I would like to place an inquiry / order.";
  const encodedText = encodeURIComponent(customText || defaultText);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-floating-btn"
      title="Chat with GlozzyFoods on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <div className="whatsapp-floating-pulse"></div>
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
};

export default WhatsAppFloating;
