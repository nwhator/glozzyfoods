import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

const AdminInventory = () => {
  const { products, updateProduct, formatNaira } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const filtered = products.filter((p) => {
    if (filterLowStock && (!p.trackInventory || p.stock > 10)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q);
    }
    return true;
  });

  const handleStockAdjustment = (productId, delta) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const newStock = Math.max(0, (product.stock || 0) + delta);
    updateProduct(productId, { stock: newStock });
  };

  const handleToggleTracking = (productId, currentState) => {
    updateProduct(productId, { trackInventory: !currentState });
  };

  const lowStockCount = products.filter((p) => p.trackInventory && p.stock <= 10).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Kitchen & Bakery Inventory</h2>
          <p className="text-muted small mb-0">
            Monitor real-time food stock levels, adjust portion quantities, and restock ingredients.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className={`btn ${filterLowStock ? "btn-danger" : "btn-outline-danger"} btn-sm rounded-pill px-3`}
            onClick={() => setFilterLowStock(!filterLowStock)}
          >
            <i className="fa-solid fa-triangle-exclamation me-1"></i>
            {filterLowStock ? "Showing Low Stock" : `Low Stock Items (${lowStockCount})`}
          </button>
        </div>
      </div>

      {/* Search and Alerts */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="fa-solid fa-magnifying-glass text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search dish or pastry inventory by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-danger bg-opacity-10 border border-danger">
            <div className="d-flex align-items-center gap-3">
              <i className="fa-solid fa-bell text-danger fs-3"></i>
              <div>
                <strong className="text-dark small d-block">Threshold Warning</strong>
                <span className="text-muted small">{lowStockCount} items below 10 units threshold</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}>Image</th>
                <th>Item & SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory Tracking</th>
                <th className="text-center">Current Stock</th>
                <th>Status</th>
                <th className="text-end">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded-3 object-fit-cover"
                      style={{ width: "42px", height: "42px" }}
                    />
                  </td>
                  <td>
                    <strong className="text-dark d-block">{p.name}</strong>
                    <small className="text-muted font-monospace">{p.sku || "GLZ-01"}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{p.categoryName}</span>
                  </td>
                  <td className="fw-bold text-danger">{formatNaira(p.discountPrice || p.price)}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={p.trackInventory !== false}
                        onChange={() => handleToggleTracking(p.id, p.trackInventory !== false)}
                      />
                      <label className="form-check-label small text-muted">
                        {p.trackInventory !== false ? "Tracked" : "Unlimited"}
                      </label>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="fs-5 fw-bold text-dark font-monospace">
                      {p.trackInventory !== false ? p.stock : "∞"}
                    </span>
                  </td>
                  <td>
                    {p.trackInventory === false ? (
                      <span className="badge bg-info text-dark rounded-pill">Always In Stock</span>
                    ) : p.stock <= 0 ? (
                      <span className="badge bg-danger rounded-pill">Out of Stock</span>
                    ) : p.stock <= 10 ? (
                      <span className="badge bg-warning text-dark rounded-pill">Low Stock ({p.stock})</span>
                    ) : (
                      <span className="badge bg-success rounded-pill">Healthy ({p.stock})</span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleStockAdjustment(p.id, -1)}
                        title="Reduce 1"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleStockAdjustment(p.id, 5)}
                        title="Add 5"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => handleStockAdjustment(p.id, 20)}
                        title="Add 20"
                      >
                        +20
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => handleStockAdjustment(p.id, 50)}
                        title="Add 50"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
