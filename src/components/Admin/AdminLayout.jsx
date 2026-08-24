import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="d-flex min-vh-100" style={{ background: "var(--g-bg-deepest)" }}>
      <AdminSidebar />
      <div className="d-flex flex-column flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
        <AdminHeader />
        <main className="flex-grow-1 p-4 overflow-auto admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
