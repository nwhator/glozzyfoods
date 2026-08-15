import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CustomerAuthPage = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [isForgot, setIsForgot] = useState(mode === "forgot");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isForgot) {
      if (!email.trim()) {
        setErrorMsg("Please enter your registered email.");
        return;
      }
      setSuccessMsg("Password reset link sent to " + email + ". Check your inbox!");
      return;
    }

    if (isRegister) {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setErrorMsg("Please fill in all fields.");
        return;
      }
      const res = register({ name, email, phone });
      if (res.success) {
        navigate(redirect);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMsg("Please enter your email and password.");
        return;
      }
      const res = login(email, password);
      if (res.success) {
        if (res.user.role === "admin" || res.user.role === "superadmin") {
          navigate("/admin");
        } else {
          navigate(redirect);
        }
      }
    }
  };

  const handleAdminDemoLogin = () => {
    login("admin@glozzyfoods.com", "admin123");
    navigate("/admin");
  };

  const handleCustomerDemoLogin = () => {
    login("osas.ighodaro@gmail.com", "customer123");
    navigate("/account");
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "500px" }}>
        <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
          <div className="text-center mb-4">
            <div className="glozzy-logo-badge d-inline-block mb-2">GF</div>
            <h3 className="fw-bold text-dark mb-1">
              {isForgot
                ? "Reset Your Password"
                : isRegister
                ? "Create Your Account"
                : "Welcome Back!"}
            </h3>
            <p className="text-muted small">
              {isForgot
                ? "Enter your email to receive recovery instructions."
                : isRegister
                ? "Join GlozzyFoods for seamless food ordering & rewards."
                : "Sign in to track orders, save favourites and reorder fast."}
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger rounded-3 py-2 px-3 small mb-3">
              <i className="fa-solid fa-triangle-exclamation me-1"></i> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success rounded-3 py-2 px-3 small mb-3">
              <i className="fa-solid fa-circle-check me-1"></i> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Osasere Ighodaro"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {isRegister && (
              <div className="mb-3">
                <label className="form-label small fw-bold">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  className="form-control rounded-3"
                  placeholder="e.g. 08023456789"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {!isForgot && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label small fw-bold">Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 text-decoration-none small"
                      onClick={() => setIsForgot(true)}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="form-control rounded-3"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="btn btn-glozzy-primary btn-lg w-100 py-3 rounded-pill shadow-sm mb-3">
              {isForgot
                ? "Send Reset Link"
                : isRegister
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          {/* Toggle between Login / Register / Forgot */}
          <div className="text-center small text-muted border-top pt-3 mt-3">
            {isForgot ? (
              <button
                type="button"
                className="btn btn-link text-danger fw-bold p-0 text-decoration-none small"
                onClick={() => {
                  setIsForgot(false);
                  setIsRegister(false);
                }}
              >
                &larr; Back to Login
              </button>
            ) : isRegister ? (
              <div>
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link text-danger fw-bold p-0 text-decoration-none small"
                  onClick={() => setIsRegister(false)}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  className="btn btn-link text-danger fw-bold p-0 text-decoration-none small"
                  onClick={() => setIsRegister(true)}
                >
                  Register Now
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Logins for Fast Evaluation */}
          <div className="mt-4 pt-3 border-top">
            <span className="small text-muted d-block text-center mb-2">⚡ Quick 1-Click Demo Login:</span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm w-50 rounded-pill"
                onClick={handleCustomerDemoLogin}
              >
                <i className="fa-solid fa-user me-1"></i> As Customer
              </button>
              <button
                type="button"
                className="btn btn-dark btn-sm w-50 rounded-pill text-warning"
                onClick={handleAdminDemoLogin}
              >
                <i className="fa-solid fa-shield-halved me-1"></i> As Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthPage;
