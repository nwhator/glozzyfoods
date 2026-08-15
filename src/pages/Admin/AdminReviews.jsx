import React from "react";
import { useStore } from "../../context/StoreContext";

const AdminReviews = () => {
  const { reviews, products, approveReview, deleteReview } = useStore();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Customer Reviews Moderation</h2>
          <p className="text-muted small mb-0">
            Moderate and approve customer feedback and taste ratings on food items and cakes.
          </p>
        </div>
        <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">
          {reviews.length} Total Reviews
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Product / Dish</th>
                <th>Customer</th>
                <th>Star Rating</th>
                <th>Customer Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => {
                const product = products.find((p) => p.id === r.productId);
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {product && (
                          <img
                            src={product.image}
                            alt=""
                            className="rounded-2 object-fit-cover"
                            style={{ width: "36px", height: "36px" }}
                          />
                        )}
                        <strong className="text-dark small">{product ? product.name : "Delicacy"}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-dark small">{r.customerName}</span>
                    </td>
                    <td>
                      <div className="text-warning small">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <i className="fa-solid fa-star me-1" key={i}></i>
                        ))}
                      </div>
                    </td>
                    <td className="small text-muted" style={{ maxWidth: "300px" }}>
                      "{r.comment}"
                    </td>
                    <td className="small text-muted font-monospace">{r.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.approved ? "bg-success" : "bg-warning text-dark"
                        } rounded-pill px-3 py-1`}
                      >
                        {r.approved ? "Approved" : "Pending Moderation"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {!r.approved && (
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() => approveReview(r.id)}
                            title="Approve"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            if (window.confirm("Delete this review?")) {
                              deleteReview(r.id);
                            }
                          }}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
