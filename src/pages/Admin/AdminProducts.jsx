import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "react-bootstrap";

const AdminProducts = () => {
  const {
    products,
    categories,
    formatNaira,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleProductActive,
    toggleProductFeatured,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState(20);
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [trackInventory, setTrackInventory] = useState(true);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [preparationTime, setPreparationTime] = useState("30 Minutes");
  const [variants, setVariants] = useState([]);

  // New variant temp inputs
  const [varName, setVarName] = useState("Size");
  const [varValue, setVarValue] = useState("");
  const [varPrice, setVarPrice] = useState("");

  const filteredProducts = products.filter((p) => {
    if (filterCat !== "all" && p.categoryId !== filterCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setPrice("");
    setDiscountPrice("");
    setStock(25);
    setSku(`GLZ-${Date.now().toString().slice(-4)}`);
    setShortDescription("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
    setTrackInventory(true);
    setActive(true);
    setFeatured(false);
    setIngredients("");
    setAllergens("None");
    setPreparationTime("30 Minutes");
    setVariants([]);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || "");
    setStock(p.stock);
    setSku(p.sku || "");
    setShortDescription(p.shortDescription || "");
    setDescription(p.description || "");
    setImage(p.image || "");
    setTrackInventory(p.trackInventory !== false);
    setActive(p.active !== false);
    setFeatured(!!p.featured);
    setIngredients(p.ingredients || "");
    setAllergens(p.allergens || "");
    setPreparationTime(p.preparationTime || "");
    setVariants(p.variants || []);
    setShowModal(true);
  };

  const handleAddVariant = () => {
    if (!varValue.trim() || !varPrice) return;
    const newV = {
      id: `v-${Date.now()}`,
      name: varName,
      value: varValue.trim(),
      price: Number(varPrice),
      stock: 20,
    };
    setVariants([...variants, newV]);
    setVarValue("");
    setVarPrice("");
  };

  const handleRemoveVariant = (vid) => {
    setVariants(variants.filter((v) => v.id !== vid));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const categoryObj = categories.find((c) => c.id === categoryId);

    const productPayload = {
      name: name.trim(),
      categoryId: categoryId,
      categoryName: categoryObj ? categoryObj.name : "African Dish",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      sku: sku.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      image: image.trim(),
      trackInventory: trackInventory,
      active: active,
      featured: featured,
      ingredients: ingredients.trim(),
      allergens: allergens.trim(),
      preparationTime: preparationTime.trim(),
      variants: variants,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Products & Menu Catalogue</h2>
          <p className="text-muted small mb-0">
            Create, edit, duplicate, and manage all food dishes, cakes, variants, and prices.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-glozzy-primary rounded-pill px-4"
          onClick={handleOpenAdd}
        >
          <i className="fa-solid fa-plus me-2"></i> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="fa-solid fa-magnifying-glass text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search products by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select rounded-3"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-md-end">
            <span className="badge bg-light text-muted border px-3 py-2 small">
              {filteredProducts.length} Products
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>Image</th>
                <th>Product Name & SKU</th>
                <th>Category</th>
                <th>Price / Discount</th>
                <th>Stock</th>
                <th>Variants</th>
                <th>Status</th>
                <th>Featured</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="rounded-3 object-fit-cover"
                      style={{ width: "48px", height: "48px" }}
                    />
                  </td>
                  <td>
                    <strong className="text-dark d-block">{p.name}</strong>
                    <small className="text-muted font-monospace">{p.sku || "GLZ-01"}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">{p.categoryName}</span>
                  </td>
                  <td>
                    <strong className="text-danger">{formatNaira(p.discountPrice || p.price)}</strong>
                    {p.discountPrice && (
                      <small className="text-muted text-decoration-line-through d-block">
                        {formatNaira(p.price)}
                      </small>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.stock <= 0
                          ? "bg-danger"
                          : p.stock <= 10
                          ? "bg-warning text-dark"
                          : "bg-success"
                      } rounded-pill`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    {p.variants && p.variants.length > 0 ? (
                      <span className="badge bg-secondary rounded-pill">
                        {p.variants.length} Options
                      </span>
                    ) : (
                      <span className="text-muted small">Standard</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        p.active ? "btn-success" : "btn-secondary"
                      } rounded-pill px-2 py-0 small`}
                      style={{ fontSize: "11px" }}
                      onClick={() => toggleProductActive(p.id)}
                    >
                      {p.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        p.featured ? "btn-warning text-dark" : "btn-light text-muted"
                      } rounded-circle p-1`}
                      onClick={() => toggleProductFeatured(p.id)}
                      title="Toggle Featured"
                    >
                      <i className={`fa-star ${p.featured ? "fa-solid" : "fa-regular"}`}></i>
                    </button>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => duplicateProduct(p.id)}
                        title="Duplicate"
                      >
                        <i className="fa-solid fa-copy"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                            deleteProduct(p.id);
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

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold text-dark">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Food Product"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <form onSubmit={handleSaveProduct}>
          <div className="modal-body p-4 max-vh-75 overflow-auto">
            <div className="row g-3 mb-4">
              {/* Product Name */}
              <div className="col-md-8">
                <label className="form-label small fw-bold">Product Name *</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Red Velvet Celebration Cake"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Category *</label>
                <select
                  className="form-select rounded-3"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Base Price (₦) *</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="15000"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Discount Price */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Discount Price (₦)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Optional discount price"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>

              {/* Stock */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Stock Quantity *</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* SKU & Image URL */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">SKU Code</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="col-md-8">
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

              {/* Short Description */}
              <div className="col-12">
                <label className="form-label small fw-bold">Short Description (for cards)</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Ultra moist red velvet sponge with rich cream cheese..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* Full Description */}
              <div className="col-12">
                <label className="form-label small fw-bold">Full Detailed Description</label>
                <textarea
                  className="form-control rounded-3"
                  rows="3"
                  placeholder="Detailed description of the meal, ingredients, and servings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Food Info: Ingredients, Allergens, Prep Time */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Prep Time</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. 25 - 35 Mins"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Key Ingredients</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Flour, butter, eggs..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Allergens</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Contains Gluten, Dairy"
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                />
              </div>
            </div>

            {/* VARIATIONS BUILDER (Sizes / Flavours / Prices) */}
            <div className="p-3 bg-light rounded-4 border mb-4">
              <h6 className="fw-bold text-dark mb-2">
                <i className="fa-solid fa-sliders text-danger me-2"></i> Product Variations (Sizes & Flavours)
              </h6>
              <p className="text-muted small mb-3">
                Add different options (e.g. 6", 8", 10" or 50cl, 1L) with custom pricing.
              </p>

              {/* Existing Variants Table */}
              {variants.length > 0 && (
                <div className="table-responsive mb-3">
                  <table className="table table-sm bg-white rounded-3">
                    <thead>
                      <tr>
                        <th>Option Type</th>
                        <th>Option Value</th>
                        <th>Price (₦)</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v) => (
                        <tr key={v.id}>
                          <td>{v.name}</td>
                          <td><strong>{v.value}</strong></td>
                          <td>{formatNaira(v.price)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 text-decoration-none small"
                              onClick={() => handleRemoveVariant(v.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add Variant Inputs */}
              <div className="row g-2 align-items-center">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-2"
                    placeholder="Type (e.g. Size)"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-2"
                    placeholder="Value (e.g. 8 Inch / 50cl)"
                    value={varValue}
                    onChange={(e) => setVarValue(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-2"
                    placeholder="Price (₦)"
                    value={varPrice}
                    onChange={(e) => setVarPrice(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm rounded-2 w-100"
                    onClick={handleAddVariant}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Switches: Active, Featured, Track Inventory */}
            <div className="d-flex gap-4 flex-wrap border-top pt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="prodActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label className="form-check-label small fw-bold" htmlFor="prodActive">
                  Product Active (Visible in store)
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="prodFeatured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <label className="form-check-label small fw-bold" htmlFor="prodFeatured">
                  Featured in Customer Favourites
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="prodTrackInv"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                />
                <label className="form-check-label small fw-bold" htmlFor="prodTrackInv">
                  Track Stock Quantity
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glozzy-primary rounded-pill px-4">
              {editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
