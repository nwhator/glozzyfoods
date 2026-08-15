import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import QuickViewModal from "../../components/Common/QuickViewModal";
import EmptyState from "../../components/Common/EmptyState";

const ShopPage = () => {
  const { products, categories, formatNaira } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (!item.active) return false;

      // Category filter
      if (selectedCategory !== "all") {
        if (item.categoryId !== selectedCategory && item.categorySlug !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        const matchesCategory = (item.categoryName || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      // Price filter
      const effectivePrice = item.discountPrice || item.price;
      if (effectivePrice > maxPrice) return false;

      // In stock filter
      if (inStockOnly && item.trackInventory && item.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (selectedSort === "price-low") return priceA - priceB;
      if (selectedSort === "price-high") return priceB - priceA;
      if (selectedSort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (selectedSort === "popular") return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      if (selectedSort === "newest") return b.id.localeCompare(a.id);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Featured first
    });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, selectedSort]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSort("featured");
    setInStockOnly(false);
    setMaxPrice(50000);
    setSearchParams({});
  };

  return (
    <div className="py-4">
      <div className="container">
        {/* Page Breadcrumb & Header */}
        <div className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
                Menu & Shop
              </li>
            </ol>
          </nav>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 className="fw-bold text-dark mb-1">Our Full Food Catalogue</h2>
              <p className="text-muted small mb-0">
                Freshly prepared African dishes, confectionery cakes, small chops, parfaits, and drinks.
              </p>
            </div>
            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 fw-bold">
              {filteredProducts.length} {filteredProducts.length === 1 ? "dish found" : "dishes available"}
            </span>
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT SIDEBAR: FILTERS */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Filters</h5>
                <button
                  type="button"
                  className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold"
                  onClick={handleResetFilters}
                >
                  Reset All
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Search Dishes</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control rounded-start-pill ps-3"
                    placeholder="Search cakes, soups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setSearchQuery("")}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark mb-2">Categories</label>
                <div className="d-flex flex-column gap-1">
                  <button
                    type="button"
                    className={`btn btn-sm text-start rounded-pill px-3 py-2 d-flex justify-content-between align-items-center ${
                      selectedCategory === "all"
                        ? "btn-danger fw-bold text-white"
                        : "btn-light text-dark"
                    }`}
                    onClick={() => handleCategorySelect("all")}
                  >
                    <span>All Categories</span>
                    <span className="badge bg-white text-dark rounded-pill">
                      {products.filter((p) => p.active).length}
                    </span>
                  </button>

                  {categories
                    .filter((c) => c.active)
                    .map((cat) => {
                      const count = products.filter((p) => p.active && p.categoryId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`btn btn-sm text-start rounded-pill px-3 py-2 d-flex justify-content-between align-items-center ${
                            selectedCategory === cat.id
                              ? "btn-danger fw-bold text-white"
                              : "btn-light text-dark"
                          }`}
                          onClick={() => handleCategorySelect(cat.id)}
                        >
                          <span>{cat.name}</span>
                          <span className={`badge ${selectedCategory === cat.id ? "bg-white text-danger" : "bg-white text-muted"} rounded-pill`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-dark mb-0">Max Price</label>
                  <span className="text-danger fw-bold small">{formatNaira(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: "11px" }}>
                  <span>₦1,000</span>
                  <span>₦50,000+</span>
                </div>
              </div>

              {/* Availability */}
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="inStockCheck"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold text-dark" htmlFor="inStockCheck">
                  In-Stock Only
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCTS LISTING */}
          <div className="col-lg-9">
            {/* Top Toolbar */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                {/* Active Category Tag */}
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Showing:</span>
                  <span className="badge bg-danger text-white rounded-pill px-3 py-2 small">
                    {selectedCategory === "all"
                      ? "All Categories"
                      : categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                  </span>
                </div>

                {/* Sort & View Controls */}
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-1">
                    <span className="small text-muted d-none d-sm-inline">Sort by:</span>
                    <select
                      className="form-select form-select-sm rounded-pill border"
                      style={{ width: "auto" }}
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                    >
                      <option value="featured">Featured First</option>
                      <option value="popular">Most Popular</option>
                      <option value="rating">Best Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest Added</option>
                    </select>
                  </div>

                  {/* Grid / List Mode */}
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className={`btn ${viewMode === "grid" ? "btn-danger" : "btn-outline-secondary"}`}
                      onClick={() => setViewMode("grid")}
                      title="Grid View"
                    >
                      <i className="fa-solid fa-grip"></i>
                    </button>
                    <button
                      type="button"
                      className={`btn ${viewMode === "list" ? "btn-danger" : "btn-outline-secondary"}`}
                      onClick={() => setViewMode("list")}
                      title="List View"
                    >
                      <i className="fa-solid fa-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-magnifying-glass"
                title="No tasty matches found"
                description="Try broadening your search term or adjusting the category and price filters."
                actionText="Reset Filters"
                actionLink="/shop"
              />
            ) : viewMode === "grid" ? (
              <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3">
                {filteredProducts.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredProducts.map((product) => (
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-3" key={product.id}>
                    <div className="row g-3 align-items-center">
                      <div className="col-sm-3 col-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-100 rounded-3 object-fit-cover"
                          style={{ height: "110px" }}
                        />
                      </div>
                      <div className="col-sm-6 col-8">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1 small">
                            {product.categoryName}
                          </span>
                          <span className="text-warning small">
                            <i className="fa-solid fa-star me-1"></i>
                            {product.rating || "5.0"}
                          </span>
                        </div>
                        <h5 className="fw-bold text-dark mb-1">
                          <Link to={`/product/${product.slug}`} className="text-dark text-decoration-none">
                            {product.name}
                          </Link>
                        </h5>
                        <p className="text-muted small mb-0 text-truncate">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                      <div className="col-sm-3 text-sm-end d-flex flex-sm-column justify-content-between align-items-end gap-2">
                        <div>
                          <div className="fs-5 fw-bold text-danger">
                            {formatNaira(product.discountPrice || product.price)}
                          </div>
                          {product.discountPrice && (
                            <small className="text-muted text-decoration-line-through">
                              {formatNaira(product.price)}
                            </small>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-glozzy-primary btn-sm rounded-pill px-3"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          <i className="fa-solid fa-cart-plus me-1"></i> Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        show={!!quickViewProduct}
        onHide={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
};

export default ShopPage;
