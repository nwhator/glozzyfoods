import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Styles
import "./assets/css/style.css";
import "./assets/css/glozzy-custom.css";

// Layouts
import CustomerLayout from "./components/Customer/CustomerLayout";
import AdminLayout from "./components/Admin/AdminLayout";

// Customer Pages
import HomePage from "./pages/Customer/HomePage";
import ShopPage from "./pages/Customer/ShopPage";
import CategoryPage from "./pages/Customer/CategoryPage";
import ProductDetailPage from "./pages/Customer/ProductDetailPage";
import CartPage from "./pages/Customer/CartPage";
import CheckoutPage from "./pages/Customer/CheckoutPage";
import OrderConfirmationPage from "./pages/Customer/OrderConfirmationPage";
import OrderTrackingPage from "./pages/Customer/OrderTrackingPage";
import CateringPage from "./pages/Customer/CateringPage";
import AboutPage from "./pages/Customer/AboutPage";
import ContactPage from "./pages/Customer/ContactPage";
import FAQPage from "./pages/Customer/FAQPage";
import { PrivacyPolicyPage, TermsPage } from "./pages/Customer/PolicyPages";
import CustomerAuthPage from "./pages/Customer/CustomerAuthPage";
import CustomerProfilePage from "./pages/Customer/CustomerProfilePage";

// Admin Pages
import AdminOverview from "./pages/Admin/AdminOverview";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminInventory from "./pages/Admin/AdminInventory";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminDeliveryZones from "./pages/Admin/AdminDeliveryZones";
import AdminHomepageCMS from "./pages/Admin/AdminHomepageCMS";
import AdminReviews from "./pages/Admin/AdminReviews";
import AdminSettings from "./pages/Admin/AdminSettings";

// Fallback Loader
const PageLoader = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="text-center">
      <div className="glozzy-logo-badge d-inline-block mb-3 animate-bounce">GF</div>
      <h5 className="fw-bold text-danger">GLOZZYFOODS</h5>
      <p className="text-muted small">Loading delicious meals...</p>
    </div>
  </div>
);

// Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) {
    return <CustomerAuthPage mode="login" />;
  }
  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Storefront Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="/catering" element={<CateringPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<CustomerAuthPage mode="login" />} />
              <Route path="/register" element={<CustomerAuthPage mode="register" />} />
              <Route path="/forgot-password" element={<CustomerAuthPage mode="forgot" />} />
              <Route path="/account" element={<CustomerProfilePage />} />
            </Route>

            {/* Admin Management Dashboard Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="delivery-zones" element={<AdminDeliveryZones />} />
              <Route path="homepage-cms" element={<AdminHomepageCMS />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
