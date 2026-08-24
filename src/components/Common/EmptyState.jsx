import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "fa-solid fa-plate-wheat",
  title = "No Items Found",
  description = "Let's fix that with something delicious from our kitchen.",
  actionText = "Explore Full Menu",
  actionLink = "/shop",
}) => {
  return (
    <div className="text-center py-5 px-3 my-4 rounded-4" style={{ maxWidth: "550px", margin: "0 auto", background: "var(--g-bg-card)", border: "1px solid var(--g-border)" }}>
      <div
        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
        style={{ width: "80px", height: "80px", fontSize: "32px", background: "var(--g-accent-light)", color: "var(--g-accent)" }}
      >
        <i className={icon}></i>
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted small mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {description}
      </p>
      {actionText && (
        <Link to={actionLink} className="btn btn-glozzy-primary px-4 py-2">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
