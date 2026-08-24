/**
 * Neon PostgreSQL Database Export Utility
 * Generates clean, production-ready PostgreSQL SQL dumps compatible with Neon (neon.tech)
 * Uses native Postgres types (JSONB, BOOLEAN, NUMERIC, TIMESTAMPTZ, CASCADE drops).
 */

const escapePgSQL = (str) => {
  if (str === null || str === undefined) return "NULL";
  if (typeof str === "number" || typeof str === "boolean") return str;
  return `'${String(str).replace(/'/g, "''")}'`;
};

export const generateNeonPostgresDump = (storeData) => {
  const {
    categories = [],
    products = [],
    deliveryZones = [],
    coupons = [],
    orders = [],
    reviews = [],
    cms = {},
  } = storeData;

  const timestamp = new Date().toISOString();

  let sql = `-- ==========================================================
-- GlozzyFoods ND More — Full Neon PostgreSQL Database Dump
-- Generated at: ${timestamp}
-- Target: Neon (PostgreSQL Serverless / neon.tech)
-- ==========================================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS delivery_zones CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS cms_settings CASCADE;

-- ----------------------------------------------------------
-- 1. Table structure for categories
-- ----------------------------------------------------------
CREATE TABLE categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

  if (categories.length > 0) {
    sql += `INSERT INTO categories (id, name, slug, description, image, active, sort_order) VALUES\n`;
    const catRows = categories.map((cat, idx) => {
      return `(${escapePgSQL(cat.id)}, ${escapePgSQL(cat.name)}, ${escapePgSQL(cat.slug)}, ${escapePgSQL(cat.description)}, ${escapePgSQL(cat.image)}, ${cat.active ? "TRUE" : "FALSE"}, ${cat.sortOrder || idx + 1})`;
    });
    sql += catRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 2. Table structure for products
-- ----------------------------------------------------------
CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  category_name VARCHAR(255),
  price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount_price NUMERIC(12,2),
  short_description TEXT,
  description TEXT,
  image VARCHAR(500),
  gallery JSONB DEFAULT '[]'::jsonb,
  sku VARCHAR(64),
  stock INT NOT NULL DEFAULT 0,
  track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  reviews_count INT NOT NULL DEFAULT 0,
  ingredients TEXT,
  allergens TEXT,
  preparation_time VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

  if (products.length > 0) {
    sql += `INSERT INTO products (id, name, slug, category_id, category_name, price, discount_price, short_description, description, image, gallery, sku, stock, track_inventory, featured, active, rating, reviews_count, ingredients, allergens, preparation_time) VALUES\n`;
    const prodRows = products.map((p) => {
      const galleryJSON = JSON.stringify(p.gallery || [p.image]);
      return `(${escapePgSQL(p.id)}, ${escapePgSQL(p.name)}, ${escapePgSQL(p.slug)}, ${escapePgSQL(p.categoryId)}, ${escapePgSQL(p.categoryName)}, ${p.price || 0}, ${p.discountPrice || "NULL"}, ${escapePgSQL(p.shortDescription)}, ${escapePgSQL(p.description)}, ${escapePgSQL(p.image)}, ${escapePgSQL(galleryJSON)}::jsonb, ${escapePgSQL(p.sku)}, ${p.stock || 0}, ${p.trackInventory ? "TRUE" : "FALSE"}, ${p.featured ? "TRUE" : "FALSE"}, ${p.active ? "TRUE" : "FALSE"}, ${p.rating || 5.0}, ${p.reviewsCount || 0}, ${escapePgSQL(p.ingredients)}, ${escapePgSQL(p.allergens)}, ${escapePgSQL(p.preparationTime)})`;
    });
    sql += prodRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 3. Table structure for product_variants
-- ----------------------------------------------------------
CREATE TABLE product_variants (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(128) NOT NULL,
  value VARCHAR(128) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0
);

`;

  const allVariants = [];
  products.forEach((p) => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        allVariants.push({ ...v, productId: p.id });
      });
    }
  });

  if (allVariants.length > 0) {
    sql += `INSERT INTO product_variants (id, product_id, name, value, price, stock) VALUES\n`;
    const varRows = allVariants.map((v) => {
      return `(${escapePgSQL(v.id)}, ${escapePgSQL(v.productId)}, ${escapePgSQL(v.name)}, ${escapePgSQL(v.value)}, ${v.price || 0}, ${v.stock || 0})`;
    });
    sql += varRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 4. Table structure for delivery_zones
-- ----------------------------------------------------------
CREATE TABLE delivery_zones (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  estimated_time VARCHAR(128),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

`;

  if (deliveryZones.length > 0) {
    sql += `INSERT INTO delivery_zones (id, name, fee, estimated_time, description, active) VALUES\n`;
    const zoneRows = deliveryZones.map((z) => {
      return `(${escapePgSQL(z.id)}, ${escapePgSQL(z.name)}, ${z.fee || 0}, ${escapePgSQL(z.estimatedTime)}, ${escapePgSQL(z.description)}, ${z.active ? "TRUE" : "FALSE"})`;
    });
    sql += zoneRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 5. Table structure for coupons
-- ----------------------------------------------------------
CREATE TABLE coupons (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  discount_type VARCHAR(32) NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  max_discount NUMERIC(10,2),
  expiry_date VARCHAR(64),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

`;

  if (coupons.length > 0) {
    sql += `INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, used_count, active) VALUES\n`;
    const coupRows = coupons.map((c) => {
      return `(${escapePgSQL(c.id)}, ${escapePgSQL(c.code)}, ${escapePgSQL(c.discountType)}, ${c.discountValue || 0}, ${c.minOrderAmount || 0}, ${c.maxDiscount || "NULL"}, ${escapePgSQL(c.expiryDate)}, ${c.usageLimit || "NULL"}, ${c.usedCount || 0}, ${c.active ? "TRUE" : "FALSE"})`;
    });
    sql += coupRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 6. Table structure for orders
-- ----------------------------------------------------------
CREATE TABLE orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(64) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_zone_id VARCHAR(64),
  delivery_zone_name VARCHAR(255),
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  order_notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_method VARCHAR(64) NOT NULL DEFAULT 'bank_transfer',
  payment_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  order_status VARCHAR(32) NOT NULL DEFAULT 'new',
  coupon_code VARCHAR(64),
  items_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

  if (orders.length > 0) {
    sql += `INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, delivery_zone_id, delivery_zone_name, delivery_fee, order_notes, subtotal, discount_amount, grand_total, payment_method, payment_status, order_status, coupon_code, items_json, created_at) VALUES\n`;
    const ordRows = orders.map((o) => {
      const itemsJSON = JSON.stringify(o.items || []);
      return `(${escapePgSQL(o.id)}, ${escapePgSQL(o.customer?.name || o.customerName)}, ${escapePgSQL(o.customer?.email || o.customerEmail)}, ${escapePgSQL(o.customer?.phone || o.customerPhone)}, ${escapePgSQL(o.customer?.address || o.deliveryAddress)}, ${escapePgSQL(o.deliveryZone?.id || o.deliveryZoneId)}, ${escapePgSQL(o.deliveryZone?.name || o.deliveryZoneName)}, ${o.deliveryFee || 0}, ${escapePgSQL(o.customer?.notes || o.orderNotes)}, ${o.subtotal || 0}, ${o.discountAmount || 0}, ${o.grandTotal || 0}, ${escapePgSQL(o.paymentMethod)}, ${escapePgSQL(o.paymentStatus)}, ${escapePgSQL(o.orderStatus)}, ${escapePgSQL(o.couponCode)}, ${escapePgSQL(itemsJSON)}::jsonb, ${escapePgSQL(o.createdAt || new Date().toISOString())})`;
    });
    sql += ordRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 7. Table structure for reviews
-- ----------------------------------------------------------
CREATE TABLE reviews (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

`;

  if (reviews.length > 0) {
    sql += `INSERT INTO reviews (id, product_id, customer_name, rating, comment, approved, created_at) VALUES\n`;
    const revRows = reviews.map((r) => {
      return `(${escapePgSQL(r.id)}, ${escapePgSQL(r.productId)}, ${escapePgSQL(r.customerName)}, ${r.rating || 5}, ${escapePgSQL(r.comment)}, ${r.approved ? "TRUE" : "FALSE"}, ${escapePgSQL(r.createdAt || new Date().toISOString())})`;
    });
    sql += revRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 8. Table structure for cms_settings
-- ----------------------------------------------------------
CREATE TABLE cms_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(128) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL
);

INSERT INTO cms_settings (setting_key, setting_value) VALUES
('store_config', ${escapePgSQL(JSON.stringify(cms))}::jsonb);
`;

  return sql;
};
