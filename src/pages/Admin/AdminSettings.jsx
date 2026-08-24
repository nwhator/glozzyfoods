import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { generateMySQLDump, downloadFile } from "../../services/mysqlExportService";
import { generateNeonPostgresDump } from "../../services/neonExportService";

const AdminSettings = () => {
  const {
    cms,
    updateCMS,
    categories,
    products,
    deliveryZones,
    coupons,
    orders,
    reviews,
  } = useStore();

  const store = cms?.storeContact || {
    brandName: "GLOZZYFOODS",
    subBrand: "ND MORE",
    phone: "+234 703 551 8331",
    whatsapp: "2347035518331",
    email: "orders@glozzyfoods.com",
    hours: "Monday – Saturday: 8:00 AM – 9:00 PM | Sunday: 11:00 AM – 7:00 PM",
    address: "Benin City, Edo State, Nigeria",
    freeDeliveryThreshold: 30000,
    bankDetails: {
      bankName: "Zenith Bank",
      accountNumber: "1018849201",
      accountName: "GLOZZYFOODS ND MORE",
    },
  };

  const [brandName, setBrandName] = useState(store.brandName);
  const [subBrand, setSubBrand] = useState(store.subBrand);
  const [phone, setPhone] = useState(store.phone);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp);
  const [email, setEmail] = useState(store.email);
  const [hours, setHours] = useState(store.hours);
  const [address, setAddress] = useState(store.address);
  const [freeThreshold, setFreeThreshold] = useState(store.freeDeliveryThreshold || 30000);

  const [bankName, setBankName] = useState(store.bankDetails?.bankName || "Zenith Bank");
  const [accountNumber, setAccountNumber] = useState(store.bankDetails?.accountNumber || "1018849201");
  const [accountName, setAccountName] = useState(store.bankDetails?.accountName || "GLOZZYFOODS ND MORE");

  const [paystackPublicKey, setPaystackPublicKey] = useState("pk_test_84920194829384910293");
  const [savedToast, setSavedToast] = useState(false);
  const [exportToast, setExportToast] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    updateCMS({
      storeContact: {
        brandName: brandName.trim(),
        subBrand: subBrand.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim().replace(/\+/g, "").replace(/\s+/g, ""),
        email: email.trim(),
        hours: hours.trim(),
        address: address.trim(),
        freeDeliveryThreshold: Number(freeThreshold),
        bankDetails: {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
        },
      },
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  // 1-Click Neon PostgreSQL SQL Export
  const handleExportNeon = () => {
    try {
      const storeData = {
        categories,
        products,
        deliveryZones,
        coupons,
        orders,
        reviews,
        cms,
      };
      const sqlContent = generateNeonPostgresDump(storeData);
      downloadFile(sqlContent, `glozzyfoods_neon_postgres_${new Date().toISOString().slice(0, 10)}.sql`, "text/sql");
      setExportToast("Neon PostgreSQL (.sql) downloaded! Open Neon Console > SQL Editor to run.");
      setTimeout(() => setExportToast(""), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to export Neon database: " + err.message);
    }
  };

  // 1-Click MySQL SQL Export
  const handleExportMySQL = () => {
    try {
      const storeData = {
        categories,
        products,
        deliveryZones,
        coupons,
        orders,
        reviews,
        cms,
      };
      const sqlContent = generateMySQLDump(storeData);
      downloadFile(sqlContent, `glozzyfoods_database_${new Date().toISOString().slice(0, 10)}.sql`, "text/sql");
      setExportToast("MySQL Database (.sql) downloaded successfully! (Collation: utf8mb4_unicode_ci)");
      setTimeout(() => setExportToast(""), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to export MySQL database: " + err.message);
    }
  };

  // 1-Click JSON Backup Export
  const handleExportJSON = () => {
    try {
      const backupData = {
        categories,
        products,
        deliveryZones,
        coupons,
        orders,
        reviews,
        cms,
        exportedAt: new Date().toISOString(),
      };
      const jsonContent = JSON.stringify(backupData, null, 2);
      downloadFile(jsonContent, `glozzyfoods_backup_${new Date().toISOString().slice(0, 10)}.json`, "application/json");
      setExportToast("JSON store backup downloaded successfully!");
      setTimeout(() => setExportToast(""), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to export JSON backup: " + err.message);
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Store & Database Settings</h2>
          <p className="text-muted small mb-0">
            Configure contacts, bank transfer details, Paystack keys, and export your database for Neon (PostgreSQL) or MySQL.
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="alert alert-success rounded-4 py-2 px-3 small mb-4 shadow-sm">
          <i className="fa-solid fa-circle-check me-2"></i> Settings saved successfully!
        </div>
      )}

      {exportToast && (
        <div className="alert alert-primary rounded-4 py-2 px-3 small mb-4 shadow-sm">
          <i className="fa-solid fa-download me-2"></i> {exportToast}
        </div>
      )}

      {/* DATABASE EXPORT & BACKUP SECTION (NEON & MYSQL) */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 border-start border-4 border-danger">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold small mb-2">
              Database Tools
            </span>
            <h4 className="fw-bold text-dark mb-1">
              <i className="fa-solid fa-database text-danger me-2"></i>
              Export Database for Neon (Postgres) or MySQL
            </h4>
            <p className="text-muted small mb-0" style={{ maxWidth: "650px" }}>
              Export the entire live store catalog (categories, products, prices, variants, delivery zones, promo coupons, reviews, and CMS config) with zero terminal commands needed.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold shadow-sm"
              onClick={handleExportNeon}
            >
              <i className="fa-solid fa-bolt"></i>
              Download Neon (Postgres) .sql
            </button>
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold"
              onClick={handleExportMySQL}
            >
              <i className="fa-solid fa-file-arrow-down"></i>
              Download MySQL .sql
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold"
              onClick={handleExportJSON}
            >
              <i className="fa-solid fa-code"></i>
              Export JSON
            </button>
          </div>
        </div>

        {/* Guides for Neon & MySQL */}
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <div className="p-3 bg-light rounded-3 border h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold small">
                <i className="fa-solid fa-bolt"></i> How to Setup with Neon (neon.tech)
              </div>
              <ol className="small text-muted mb-0 ps-3" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                <li>Log in to your <strong>Neon Console</strong> at <a href="https://console.neon.tech" target="_blank" rel="noreferrer" className="text-decoration-underline text-success">console.neon.tech</a>.</li>
                <li>Create a new project (e.g. <code>glozzyfoods-db</code>) or select your existing database.</li>
                <li>In the left sidebar, click <strong>SQL Editor</strong>.</li>
                <li>Click <strong>New Query</strong>, copy & paste the contents of <code className="text-dark">glozzyfoods_neon_postgres.sql</code>, and click <strong>Run</strong>.</li>
                <li>Copy your connection string from the <strong>Dashboard</strong> tab.</li>
              </ol>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 bg-light rounded-3 border h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-danger fw-bold small">
                <i className="fa-solid fa-database"></i> How to Import in MySQL / phpMyAdmin
              </div>
              <ol className="small text-muted mb-0 ps-3" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                <li>Open <strong>phpMyAdmin</strong> in your hosting/cPanel.</li>
                <li>Select your database on the left sidebar.</li>
                <li>Click the <strong>Import</strong> tab at the top.</li>
                <li>Click <strong>Choose File</strong>, select <code className="text-dark">glozzyfoods_database.sql</code>, and click <strong>Go</strong>.</li>
                <li>Uses universal <code>utf8mb4_unicode_ci</code> collation (no errors).</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* BRAND PROFILE */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-store text-danger me-2"></i> Brand Profile & Contacts
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Primary Brand Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Secondary Brand Text</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={subBrand}
                    onChange={(e) => setSubBrand(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">WhatsApp Number (No +)</label>
                  <input
                    type="text"
                    className="form-control rounded-3 font-monospace"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Customer Support Email</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Kitchen & Delivery Hours</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Physical Operating Base / City</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT & BANKING SETTINGS */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-building-columns text-danger me-2"></i> Bank Transfer Account
              </h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Bank Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Account Number</label>
                  <input
                    type="text"
                    className="form-control rounded-3 font-monospace fw-bold text-danger"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Account Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
              </div>

              <h5 className="fw-bold text-dark mb-3 border-top pt-3">
                <i className="fa-solid fa-credit-card text-warning me-2"></i> Paystack Gateway Config
              </h5>
              <div className="mb-3">
                <label className="form-label small fw-bold">Paystack Public Key</label>
                <input
                  type="text"
                  className="form-control rounded-3 font-monospace small"
                  value={paystackPublicKey}
                  onChange={(e) => setPaystackPublicKey(e.target.value)}
                />
                <small className="text-muted">Used for initializing online card & USSD payments on checkout.</small>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Free Delivery Threshold (₦)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-glozzy-primary btn-lg rounded-pill px-5 shadow-sm">
            <i className="fa-solid fa-floppy-disk me-2"></i> Save Business Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
