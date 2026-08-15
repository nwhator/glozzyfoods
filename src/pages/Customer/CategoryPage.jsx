import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/Common/ProductCard";
import QuickViewModal from "../../components/Common/QuickViewModal";
import EmptyState from "../../components/Common/EmptyState";

const CategoryPage = () => {
  const { slug } = useParams();
  const { categories, products } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter(
    (p) => p.active && (p.categoryId === category?.id || p.categorySlug === slug)
  );

  if (!category) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="fa-solid fa-triangle-exclamation"
          title="Category Not Found"
          description="The category you're looking for doesn't exist or has been moved."
          actionText="Explore All Menu"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none text-muted">Menu</Link>
            </li>
            <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Category Hero Banner */}
        <div className="card bg-danger text-white border-0 rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="row g-0 align-items-center">
            <div className="col-md-8 p-4 p-md-5">
              <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-2">
                Food Category
              </span>
              <h1 className="fw-bold mb-2">{category.name}</h1>
              <p className="text-white-50 mb-0" style={{ maxWidth: "550px", fontSize: "16px" }}>
                {category.description}
              </p>
            </div>
            <div className="col-md-4 d-none d-md-block">
              <img
                src={category.image}
                alt={category.name}
                className="w-100 object-fit-cover"
                style={{ height: "200px" }}
              />
            </div>
          </div>
        </div>

        {/* Category Products */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-dark mb-0">All {category.name} ({categoryProducts.length})</h3>
          <Link to="/shop" className="btn btn-outline-danger btn-sm rounded-pill px-3">
            &larr; Back to Full Menu
          </Link>
        </div>

        {categoryProducts.length === 0 ? (
          <EmptyState
            icon="fa-solid fa-kitchen-set"
            title={`No ${category.name} Currently Available`}
            description="We're currently preparing new batches of this category. Check out our full menu in the meantime."
            actionText="Browse Full Menu"
            actionLink="/shop"
          />
        ) : (
          <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
            {categoryProducts.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal
        show={!!quickViewProduct}
        onHide={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
};

export default CategoryPage;
