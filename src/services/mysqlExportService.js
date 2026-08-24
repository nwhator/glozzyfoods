/**
 * MySQL Database Export Utility
 * Generates clean, production-ready SQL dumps compatible with all MySQL versions (5.5 - 8.x, MariaDB)
 * Uses universal utf8mb4_unicode_ci collation to prevent any collation mismatch errors in phpMyAdmin.
 */

const escapeSQL = (str) => {
  if (str === null || str === undefined) return "NULL";
  if (typeof str === "number" || typeof str === "boolean") return str;
  return `'${String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
};

export const generateMySQLDump = (storeData) => {
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
-- GlozzyFoods ND More — Full Database SQL Dump
-- Generated at: ${timestamp}
-- Target: MySQL 5.5+ / 5.7 / 8.0+ / MariaDB / phpMyAdmin
-- Collation: utf8mb4_unicode_ci (Universally Compatible)
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 1. Table structure for \`categories\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`image\` varchar(500) DEFAULT NULL,
  \`active\` tinyint(1) NOT NULL DEFAULT 1,
  \`sort_order\` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug_unique\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`categories\`
`;

  if (categories.length > 0) {
    sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`image\`, \`active\`, \`sort_order\`) VALUES\n`;
    const catRows = categories.map((cat, idx) => {
      return `(${escapeSQL(cat.id)}, ${escapeSQL(cat.name)}, ${escapeSQL(cat.slug)}, ${escapeSQL(cat.description)}, ${escapeSQL(cat.image)}, ${cat.active ? 1 : 0}, ${cat.sortOrder || idx + 1})`;
    });
    sql += catRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 2. Table structure for \`products\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`category_id\` varchar(64) NOT NULL,
  \`category_name\` varchar(255) DEFAULT NULL,
  \`price\` decimal(12,2) NOT NULL DEFAULT 0.00,
  \`discount_price\` decimal(12,2) DEFAULT NULL,
  \`short_description\` text DEFAULT NULL,
  \`description\` longtext DEFAULT NULL,
  \`image\` varchar(500) DEFAULT NULL,
  \`gallery\` json DEFAULT NULL,
  \`sku\` varchar(64) DEFAULT NULL,
  \`stock\` int(11) NOT NULL DEFAULT 0,
  \`track_inventory\` tinyint(1) NOT NULL DEFAULT 1,
  \`featured\` tinyint(1) NOT NULL DEFAULT 0,
  \`active\` tinyint(1) NOT NULL DEFAULT 1,
  \`rating\` decimal(3,2) NOT NULL DEFAULT 5.00,
  \`reviews_count\` int(11) NOT NULL DEFAULT 0,
  \`ingredients\` text DEFAULT NULL,
  \`allergens\` text DEFAULT NULL,
  \`preparation_time\` varchar(128) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`prod_slug_unique\` (\`slug\`),
  KEY \`category_id_idx\` (\`category_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`products\`
`;

  if (products.length > 0) {
    sql += `INSERT INTO \`products\` (\`id\`, \`name\`, \`slug\`, \`category_id\`, \`category_name\`, \`price\`, \`discount_price\`, \`short_description\`, \`description\`, \`image\`, \`gallery\`, \`sku\`, \`stock\`, \`track_inventory\`, \`featured\`, \`active\`, \`rating\`, \`reviews_count\`, \`ingredients\`, \`allergens\`, \`preparation_time\`) VALUES\n`;
    const prodRows = products.map((p) => {
      const galleryJSON = JSON.stringify(p.gallery || [p.image]);
      return `(${escapeSQL(p.id)}, ${escapeSQL(p.name)}, ${escapeSQL(p.slug)}, ${escapeSQL(p.categoryId)}, ${escapeSQL(p.categoryName)}, ${p.price || 0}, ${p.discountPrice || "NULL"}, ${escapeSQL(p.shortDescription)}, ${escapeSQL(p.description)}, ${escapeSQL(p.image)}, ${escapeSQL(galleryJSON)}, ${escapeSQL(p.sku)}, ${p.stock || 0}, ${p.trackInventory ? 1 : 0}, ${p.featured ? 1 : 0}, ${p.active ? 1 : 0}, ${p.rating || 5.0}, ${p.reviewsCount || 0}, ${escapeSQL(p.ingredients)}, ${escapeSQL(p.allergens)}, ${escapeSQL(p.preparationTime)})`;
    });
    sql += prodRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 3. Table structure for \`product_variants\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`product_variants\`;
CREATE TABLE \`product_variants\` (
  \`id\` varchar(64) NOT NULL,
  \`product_id\` varchar(64) NOT NULL,
  \`name\` varchar(128) NOT NULL,
  \`value\` varchar(128) NOT NULL,
  \`price\` decimal(12,2) NOT NULL DEFAULT 0.00,
  \`stock\` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (\`id\`),
  KEY \`product_id_idx\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`product_variants\`
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
    sql += `INSERT INTO \`product_variants\` (\`id\`, \`product_id\`, \`name\`, \`value\`, \`price\`, \`stock\`) VALUES\n`;
    const varRows = allVariants.map((v) => {
      return `(${escapeSQL(v.id)}, ${escapeSQL(v.productId)}, ${escapeSQL(v.name)}, ${escapeSQL(v.value)}, ${v.price || 0}, ${v.stock || 0})`;
    });
    sql += varRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 4. Table structure for \`delivery_zones\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`delivery_zones\`;
CREATE TABLE \`delivery_zones\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`fee\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`estimated_time\` varchar(128) DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`active\` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`delivery_zones\`
`;

  if (deliveryZones.length > 0) {
    sql += `INSERT INTO \`delivery_zones\` (\`id\`, \`name\`, \`fee\`, \`estimated_time\`, \`description\`, \`active\`) VALUES\n`;
    const zoneRows = deliveryZones.map((z) => {
      return `(${escapeSQL(z.id)}, ${escapeSQL(z.name)}, ${z.fee || 0}, ${escapeSQL(z.estimatedTime)}, ${escapeSQL(z.description)}, ${z.active ? 1 : 0})`;
    });
    sql += zoneRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 5. Table structure for \`coupons\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`coupons\`;
CREATE TABLE \`coupons\` (
  \`id\` varchar(64) NOT NULL,
  \`code\` varchar(64) NOT NULL,
  \`discount_type\` varchar(32) NOT NULL DEFAULT 'percentage',
  \`discount_value\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`min_order_amount\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`max_discount\` decimal(10,2) DEFAULT NULL,
  \`expiry_date\` varchar(64) DEFAULT NULL,
  \`usage_limit\` int(11) DEFAULT NULL,
  \`used_count\` int(11) NOT NULL DEFAULT 0,
  \`active\` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`code_unique\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`coupons\`
`;

  if (coupons.length > 0) {
    sql += `INSERT INTO \`coupons\` (\`id\`, \`code\`, \`discount_type\`, \`discount_value\`, \`min_order_amount\`, \`max_discount\`, \`expiry_date\`, \`usage_limit\`, \`used_count\`, \`active\`) VALUES\n`;
    const coupRows = coupons.map((c) => {
      return `(${escapeSQL(c.id)}, ${escapeSQL(c.code)}, ${escapeSQL(c.discountType)}, ${c.discountValue || 0}, ${c.minOrderAmount || 0}, ${c.maxDiscount || "NULL"}, ${escapeSQL(c.expiryDate)}, ${c.usageLimit || "NULL"}, ${c.usedCount || 0}, ${c.active ? 1 : 0})`;
    });
    sql += coupRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 6. Table structure for \`orders\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` varchar(64) NOT NULL,
  \`customer_name\` varchar(255) NOT NULL,
  \`customer_email\` varchar(255) DEFAULT NULL,
  \`customer_phone\` varchar(64) NOT NULL,
  \`delivery_address\` text NOT NULL,
  \`delivery_zone_id\` varchar(64) DEFAULT NULL,
  \`delivery_zone_name\` varchar(255) DEFAULT NULL,
  \`delivery_fee\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`order_notes\` text DEFAULT NULL,
  \`subtotal\` decimal(12,2) NOT NULL DEFAULT 0.00,
  \`discount_amount\` decimal(10,2) NOT NULL DEFAULT 0.00,
  \`grand_total\` decimal(12,2) NOT NULL DEFAULT 0.00,
  \`payment_method\` varchar(64) NOT NULL DEFAULT 'bank_transfer',
  \`payment_status\` varchar(32) NOT NULL DEFAULT 'pending',
  \`order_status\` varchar(32) NOT NULL DEFAULT 'new',
  \`coupon_code\` varchar(64) DEFAULT NULL,
  \`items_json\` longtext DEFAULT NULL,
  \`created_at\` varchar(64) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`orders\`
`;

  if (orders.length > 0) {
    sql += `INSERT INTO \`orders\` (\`id\`, \`customer_name\`, \`customer_email\`, \`customer_phone\`, \`delivery_address\`, \`delivery_zone_id\`, \`delivery_zone_name\`, \`delivery_fee\`, \`order_notes\`, \`subtotal\`, \`discount_amount\`, \`grand_total\`, \`payment_method\`, \`payment_status\`, \`order_status\`, \`coupon_code\`, \`items_json\`, \`created_at\`) VALUES\n`;
    const ordRows = orders.map((o) => {
      const itemsJSON = JSON.stringify(o.items || []);
      return `(${escapeSQL(o.id)}, ${escapeSQL(o.customer?.name || o.customerName)}, ${escapeSQL(o.customer?.email || o.customerEmail)}, ${escapeSQL(o.customer?.phone || o.customerPhone)}, ${escapeSQL(o.customer?.address || o.deliveryAddress)}, ${escapeSQL(o.deliveryZone?.id || o.deliveryZoneId)}, ${escapeSQL(o.deliveryZone?.name || o.deliveryZoneName)}, ${o.deliveryFee || 0}, ${escapeSQL(o.customer?.notes || o.orderNotes)}, ${o.subtotal || 0}, ${o.discountAmount || 0}, ${o.grandTotal || 0}, ${escapeSQL(o.paymentMethod)}, ${escapeSQL(o.paymentStatus)}, ${escapeSQL(o.orderStatus)}, ${escapeSQL(o.couponCode)}, ${escapeSQL(itemsJSON)}, ${escapeSQL(o.createdAt)})`;
    });
    sql += ordRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 7. Table structure for \`reviews\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`reviews\`;
CREATE TABLE \`reviews\` (
  \`id\` varchar(64) NOT NULL,
  \`product_id\` varchar(64) NOT NULL,
  \`customer_name\` varchar(255) NOT NULL,
  \`rating\` int(11) NOT NULL DEFAULT 5,
  \`comment\` text NOT NULL,
  \`approved\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` varchar(64) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`product_id_idx\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`reviews\`
`;

  if (reviews.length > 0) {
    sql += `INSERT INTO \`reviews\` (\`id\`, \`product_id\`, \`customer_name\`, \`rating\`, \`comment\`, \`approved\`, \`created_at\`) VALUES\n`;
    const revRows = reviews.map((r) => {
      return `(${escapeSQL(r.id)}, ${escapeSQL(r.productId)}, ${escapeSQL(r.customerName)}, ${r.rating || 5}, ${escapeSQL(r.comment)}, ${r.approved ? 1 : 0}, ${escapeSQL(r.createdAt)})`;
    });
    sql += revRows.join(",\n") + ";\n\n";
  }

  sql += `-- ----------------------------------------------------------
-- 8. Table structure for \`cms_settings\`
-- ----------------------------------------------------------
DROP TABLE IF EXISTS \`cms_settings\`;
CREATE TABLE \`cms_settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`setting_key\` varchar(128) NOT NULL,
  \`setting_value\` longtext NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`setting_key_unique\` (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`cms_settings\`
INSERT INTO \`cms_settings\` (\`setting_key\`, \`setting_value\`) VALUES
('store_config', ${escapeSQL(JSON.stringify(cms))});

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;

  return sql;
};

/**
 * Triggers a browser download of a file
 */
export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
