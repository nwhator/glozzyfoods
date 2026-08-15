import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_CMS,
  INITIAL_REVIEWS,
} from "../data/initialStoreData";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Load or initialize state with localStorage persistence
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("glozzy_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("glozzy_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [deliveryZones, setDeliveryZones] = useState(() => {
    const saved = localStorage.getItem("glozzy_zones");
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_ZONES;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem("glozzy_coupons");
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("glozzy_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("glozzy_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cms, setCms] = useState(() => {
    const saved = localStorage.getItem("glozzy_cms");
    return saved ? JSON.parse(saved) : INITIAL_CMS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("glozzy_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("glozzy_active_coupon");
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("glozzy_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("glozzy_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("glozzy_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("glozzy_zones", JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem("glozzy_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("glozzy_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("glozzy_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("glozzy_cms", JSON.stringify(cms));
  }, [cms]);

  useEffect(() => {
    localStorage.setItem("glozzy_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("glozzy_active_coupon", JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem("glozzy_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Helper currency formatter
  const formatNaira = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "₦0";
    return "₦" + Number(amount).toLocaleString("en-NG");
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Management
  const addToCart = (product, selectedVariant = null, quantity = 1, specialNote = "") => {
    const effectivePrice = selectedVariant
      ? selectedVariant.price
      : product.discountPrice || product.price;

    const variantId = selectedVariant ? selectedVariant.id : "default";
    const variantName = selectedVariant
      ? `${selectedVariant.name}: ${selectedVariant.value}`
      : "Standard";

    const cartItemId = `${product.id}_${variantId}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (specialNote) updated[existingIndex].specialNote = specialNote;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            productSlug: product.slug,
            name: product.name,
            variantId: variantId,
            variantName: variantName,
            price: effectivePrice,
            image: product.image,
            quantity: quantity,
            specialNote: specialNote,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon Application
  const applyCoupon = (code) => {
    if (!code) return { success: false, message: "Please enter a coupon code." };
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: "Invalid or expired coupon code." };
    }
    if (cartSubtotal < found.minimumOrder) {
      return {
        success: false,
        message: `This coupon requires a minimum order of ${formatNaira(found.minimumOrder)}.`,
      };
    }

    let discountValue = 0;
    if (found.type === "percentage") {
      discountValue = Math.round((cartSubtotal * found.value) / 100);
      if (found.maximumDiscount && discountValue > found.maximumDiscount) {
        discountValue = found.maximumDiscount;
      }
    } else {
      discountValue = found.value;
    }

    const appliedObj = {
      ...found,
      calculatedDiscount: discountValue,
    };
    setAppliedCoupon(appliedObj);
    return {
      success: true,
      message: `Coupon "${found.code}" applied! You saved ${formatNaira(discountValue)}.`,
      discount: discountValue,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Checkout and Order Placement
  const placeOrder = (orderData) => {
    // Generate order number like GF-849204
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `GF-${randomSuffix}`;

    // Calculate real prices server-side
    let calculatedSubtotal = 0;
    const validatedItems = orderData.items.map((item) => {
      const dbProduct = products.find((p) => p.id === item.productId);
      let unitPrice = item.price;
      if (dbProduct) {
        if (item.variantId && item.variantId !== "default") {
          const v = dbProduct.variants?.find((v) => v.id === item.variantId);
          if (v) unitPrice = v.price;
        } else {
          unitPrice = dbProduct.discountPrice || dbProduct.price;
        }
      }
      calculatedSubtotal += unitPrice * item.quantity;
      return {
        productId: item.productId,
        productName: item.name || item.productName,
        variantName: item.variantName || "Standard",
        price: unitPrice,
        quantity: item.quantity,
        image: item.image,
      };
    });

    let discountAmount = 0;
    if (appliedCoupon && calculatedSubtotal >= (appliedCoupon.minimumOrder || 0)) {
      if (appliedCoupon.type === "percentage") {
        discountAmount = Math.round((calculatedSubtotal * appliedCoupon.value) / 100);
        if (appliedCoupon.maximumDiscount && discountAmount > appliedCoupon.maximumDiscount) {
          discountAmount = appliedCoupon.maximumDiscount;
        }
      } else {
        discountAmount = appliedCoupon.value;
      }
    }

    const deliveryFee = orderData.orderType === "pickup" ? 0 : (orderData.deliveryFee || 0);
    const finalTotal = Math.max(0, calculatedSubtotal + deliveryFee - discountAmount);

    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: orderNumber,
      userId: orderData.userId || "guest",
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      orderType: orderData.orderType || "delivery",
      deliveryAddress: orderData.orderType === "pickup" ? "Pickup at GlozzyFoods Store" : orderData.deliveryAddress,
      deliveryZone: orderData.deliveryZone || "Standard",
      customerNotes: orderData.customerNotes || "",
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee: deliveryFee,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total: finalTotal,
      paymentMethod: orderData.paymentMethod || "Paystack",
      paymentReference: orderData.paymentReference || `REF-${Date.now()}`,
      paymentStatus: orderData.paymentStatus || "Paid",
      orderStatus: "Pending",
      internalNotes: "New order received.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderedItem = validatedItems.find((vi) => vi.productId === p.id);
        if (orderedItem && p.trackInventory) {
          const newStock = Math.max(0, p.stock - orderedItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Save order
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  // Order Management
  const updateOrderStatus = (orderId, newStatus, internalNotes = "") => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            internalNotes: internalNotes || o.internalNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  };

  // Admin Product Actions
  const addProduct = (productData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      rating: 5.0,
      reviewsCount: 0,
      active: true,
      featured: false,
      trackInventory: true,
      variants: [],
      gallery: [productData.image],
      ...productData,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const duplicateProduct = (productId) => {
    const original = products.find((p) => p.id === productId);
    if (!original) return;
    const duplicated = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${original.sku}-CP`,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const toggleProductActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  const toggleProductFeatured = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: !p.featured } : p))
    );
  };

  // Category Actions
  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      active: true,
      sortOrder: categories.length + 1,
      ...categoryData,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (categoryId, updatedFields) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // Coupon Actions
  const addCoupon = (couponData) => {
    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: couponData.code.toUpperCase(),
      usageCount: 0,
      active: true,
      ...couponData,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const updateCoupon = (couponId, updatedFields) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCoupon = (couponId) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  // Delivery Zone Actions
  const addDeliveryZone = (zoneData) => {
    const newZone = {
      id: `zone-${Date.now()}`,
      active: true,
      ...zoneData,
    };
    setDeliveryZones((prev) => [...prev, newZone]);
  };

  const updateDeliveryZone = (zoneId, updatedFields) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, ...updatedFields } : z))
    );
  };

  const deleteDeliveryZone = (zoneId) => {
    setDeliveryZones((prev) => prev.filter((z) => z.id !== zoneId));
  };

  // CMS Actions
  const updateCMS = (newCms) => {
    setCms((prev) => ({ ...prev, ...newCms }));
  };

  // Reviews
  const addReview = (reviewData) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      approved: true,
      ...reviewData,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const approveReview = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, approved: true } : r))
    );
  };

  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        deliveryZones,
        coupons,
        orders,
        reviews,
        cms,
        cart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        wishlist,
        formatNaira,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductActive,
        toggleProductFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        updateCMS,
        addReview,
        approveReview,
        deleteReview,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
