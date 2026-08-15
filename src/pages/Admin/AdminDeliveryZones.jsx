import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const AdminDeliveryZones = () => {
  const { deliveryZones, formatNaira, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const [name, setName] = useState("");
  const [fee, setFee] = useState(1500);
  const [estimatedTime, setEstimatedTime] = useState("30 - 45 mins");
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setName("");
    setFee(1500);
    setEstimatedTime("30 - 45 mins");
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (zone) => {
    setEditingZone(zone);
    setName(zone.name);
    setFee(zone.fee);
    setEstimatedTime(zone.estimatedTime);
    setActive(zone.active);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      fee: Number(fee),
      estimatedTime: estimatedTime.trim(),
      active: active,
    };

    if (editingZone) {
      updateDeliveryZone(editingZone.id, payload);
    } else {
      addDeliveryZone(payload);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Delivery Zones & Dispatch Fees</h2>
          <p className="text-muted small mb-0">
            Configure dynamic delivery fees and dispatch arrival times for different zones in Benin City.
          </p>
        </div>
        <button type="button" className="btn btn-glozzy-primary rounded-pill px-4" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus me-2"></i> Add Delivery Zone
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Zone / Coverage Area Name</th>
                <th>Delivery Fee</th>
                <th>Estimated Dispatch Time</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryZones.map((z) => (
                <tr key={z.id}>
                  <td>
                    <strong className="text-dark d-block">{z.name}</strong>
                  </td>
                  <td>
                    <strong className="text-danger fs-6">{formatNaira(z.fee)}</strong>
                  </td>
                  <td>
                    <span className="small text-muted">
                      <i className="fa-solid fa-clock me-1 text-warning"></i>
                      {z.estimatedTime}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${z.active ? "btn-success" : "btn-secondary"} rounded-pill px-2 py-0`}
                      style={{ fontSize: "11px" }}
                      onClick={() => updateDeliveryZone(z.id, { active: !z.active })}
                    >
                      {z.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenEdit(z)}
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          if (window.confirm(`Delete delivery zone ${z.name}?`)) {
                            deleteDeliveryZone(z.id);
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
            {editingZone ? `Edit Zone: ${editingZone.name}` : "Add Delivery Zone"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Zone Name & Landmarks *</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. Benin City — Zone 1 (GRA, Airport Road)"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Delivery Fee (₦) *</label>
              <input
                type="number"
                className="form-control rounded-3"
                placeholder="1500"
                required
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Estimated Arrival Window</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. 25 - 40 mins"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="zoneActive"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label small fw-bold" htmlFor="zoneActive">
                Zone Active in Checkout Selection
              </label>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              {editingZone ? "Save Changes" : "Create Zone"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDeliveryZones;
