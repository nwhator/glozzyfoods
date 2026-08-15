import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const INITIAL_USERS = [
  {
    id: "admin-1",
    name: "Glozzy Admin",
    email: "admin@glozzyfoods.com",
    phone: "+234 703 551 8331",
    role: "admin", // superadmin, admin, staff, customer
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "cust-1",
    name: "Osasere Ighodaro",
    email: "osas.ighodaro@gmail.com",
    phone: "+234 802 345 6789",
    address: "14 Reservation Road, GRA, Benin City",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("glozzy_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("glozzy_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem("glozzy_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("glozzy_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("glozzy_auth_user");
    }
  }, [currentUser]);

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    // Check if matching admin demo credentials or registered user
    if (trimmedEmail === "admin@glozzyfoods.com") {
      const adminUser = users.find((u) => u.email === "admin@glozzyfoods.com") || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }

    // Auto-create customer if logging in for first time in demo
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: email.split("@")[0],
      email: trimmedEmail,
      phone: "+234 800 000 0000",
      role: "customer",
    };
    setUsers((prev) => [...prev, newCustomer]);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer };
  };

  const register = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: `cust-${Date.now()}`,
      name: userData.name,
      email: trimmedEmail,
      phone: userData.phone || "+234 703 551 8331",
      address: userData.address || "",
      role: userData.role || "customer",
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin" || currentUser?.role === "staff";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
