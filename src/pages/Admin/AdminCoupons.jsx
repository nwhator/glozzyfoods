import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const AdminCoupons = () => {
  const { coupons, formatNaira, addCoupon, updateCoupon, deleteCoupon } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage"); // percentage or fixed
  const [value, setValue] = useState(10);
  const [minimumOrder, setMinimumOrder] = useState(10000);
  const [maximumDiscount, setMaximumDiscount] = useState(5000);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState(200);
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode("");
    setType("percentage");
    setValue(10);
    setMinimumOrder(10000);
    setMaximumDiscount(5000);
    setExpiryDate("2026-12-31");
    setUsageLimit(200);
    setDescription("");
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (cp) => {
    setEditingCoupon(cp);
    setCode(cp.code);
    setType(cp.type);
    setValue(cp.value);
    setMinimumOrder(cp.minimumOrder);
    setMaximumDiscount(cp.maximumDiscount || 5000);
    setExpiryDate(cp.expiryDate);
    setUsageLimit(cp.usageLimit || 100);
    setDescription(cp.description || "");
    setActive(cp.active);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      code: code.trim().toUpperCase(),
      type: type,
      value: Number(value),
      minimumOrder: Number(minimumOrder),
      maximumDiscount: Number(maximumDiscount),
      expiryDate: expiryDate,
      usageLimit: Number(usageLimit),
      description: description.trim(),
      active: active,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, payload);
    } else {
      addCoupon(payload);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Promotions & Coupons Manager</h2>
          <p className="text-muted small mb-0">
            Create discount codes, set percentage or fixed discounts, and track usage.
          </p>
        </div>
        <button type="button" className="btn btn-glozzy-primary rounded-pill px-4" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus me-2"></i> Create Coupon Code
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Coupon Code</th>
                <th>Discount Type & Value</th>
                <th>Min. Order Spend</th>
                <th>Max. Discount Cap</th>
                <th>Usage Count</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((cp) => (
                <tr key={cp.id}>
                  <td>
                    <strong className="text-danger font-monospace fs-6">{cp.code}</strong>
                    {cp.description && <small className="text-muted d-block">{cp.description}</small>}
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark px-3 py-1 fw-bold">
                      {cp.type === "percentage" ? `${cp.value}% OFF` : `₦${cp.value} Flat OFF`}
                    </span>
                  </td>
                  <td>
                    <span className="fw-semibold text-dark">{formatNaira(cp.minimumOrder)}</span>
                  </td>
                  <td>
                    <span className="text-muted">{cp.maximumDiscount ? formatNaira(cp.maximumDiscount) : "No limit"}</span>
                  </td>
                  <td>
                    <span className="small text-muted">{cp.usageCount || 0} / {cp.usageLimit || "∞"}</span>
                  </td>
                  <td>
                    <span className="small text-muted font-monospace">{cp.expiryDate}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${cp.active ? "btn-success" : "btn-secondary"} rounded-pill px-2 py-0`}
                      style={{ fontSize: "11px" }}
                      onClick={() => updateCoupon(cp.id, { active: !cp.active })}
                    >
                      {cp.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenEdit(cp)}
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          if (window.confirm(`Delete coupon ${cp.code}?`)) {
                            deleteCoupon(cp.id);
                          }
                        }}
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark">
            {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create Discount Coupon"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Coupon Code *</label>
              <input
                type="text"
                className="form-control text-uppercase font-monospace rounded-3"
                placeholder="e.g. GLOZZY10"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Discount Type</label>
                <select
                  className="form-select rounded-3"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  {type === "percentage" ? "Percentage Value (%)" : "Discount Amount (₦)"}
                </label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Minimum Order Amount (₦)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  required
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Maximum Discount Cap (₦)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  value={maximumDiscount}
                  onChange={(e) => setMaximumDiscount(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Expiry Date</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Max Usage Limit</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Description / Terms</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. 10% off for orders above ₦15,000"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="cpActive"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label small fw-bold" htmlFor="cpActive">
                Coupon Active for Customer Checkout
              </label>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              {editingCoupon ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;
