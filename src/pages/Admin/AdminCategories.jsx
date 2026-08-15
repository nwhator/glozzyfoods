import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const AdminCategories = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80");
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setActive(cat.active);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      active: active,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Menu Categories Manager</h2>
          <p className="text-muted small mb-0">
            Organize food categories (Cakes, Small Chops, Soups, African Dishes, Drinks, etc.).
          </p>
        </div>
        <button type="button" className="btn btn-glozzy-primary rounded-pill px-4" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus me-2"></i> Add New Category
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>Image</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Dishes Count</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <tr key={cat.id}>
                    <td>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="rounded-3 object-fit-cover"
                        style={{ width: "44px", height: "44px" }}
                      />
                    </td>
                    <td>
                      <strong className="text-dark">{cat.name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-light text-muted border font-monospace">{cat.slug}</span>
                    </td>
                    <td className="small text-muted" style={{ maxWidth: "250px" }}>
                      {cat.description}
                    </td>
                    <td>
                      <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1">
                        {count} Dishes
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${cat.active ? "btn-success" : "btn-secondary"} rounded-pill px-2 py-0`}
                        style={{ fontSize: "11px" }}
                        onClick={() => updateCategory(cat.id, { active: !cat.active })}
                      >
                        {cat.active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Delete category ${cat.name}?`)) {
                              deleteCategory(cat.id);
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

      {/* ADD / EDIT CATEGORY MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark">
            {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">Category Name *</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. Small Chops"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Image URL *</label>
              <input
                type="url"
                className="form-control rounded-3"
                placeholder="https://images.unsplash.com/..."
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Short Description</label>
              <textarea
                className="form-control rounded-3"
                rows="3"
                placeholder="Brief summary of dishes in this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-check form-switch mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="catActive"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label small fw-bold" htmlFor="catActive">
                Category Active (Visible in Store navigation)
              </label>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
