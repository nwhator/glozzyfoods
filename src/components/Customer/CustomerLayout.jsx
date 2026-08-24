import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import MobileBottomNav from "../Common/MobileBottomNav";
import WhatsAppFloating from "../Common/WhatsAppFloating";
import ScrollToTop from "../Common/ScrollToTop";

const CustomerLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFloating />
      <ScrollToTop />
    </div>
  );
};

export default CustomerLayout;
