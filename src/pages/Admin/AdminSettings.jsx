import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

const AdminSettings = () => {
  const { cms, updateCMS } = useStore();

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Business & Payment Settings</h2>
          <p className="text-muted small mb-0">
            Configure official brand contacts, bank transfer destination, and Paystack integration.
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="alert alert-success rounded-4 py-2 px-3 small mb-4 shadow-sm">
          <i className="fa-solid fa-circle-check me-2"></i> Settings saved successfully!
        </div>
      )}

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
