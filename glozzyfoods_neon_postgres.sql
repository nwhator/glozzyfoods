-- ==========================================================
-- GlozzyFoods ND More — Complete Neon PostgreSQL Database Setup
-- Target: Neon (PostgreSQL 14 / 15 / 16 / 17 Serverless)
-- How to run: Open Neon Console -> Go to "SQL Editor" -> Paste and click "Run"
-- ==========================================================

-- Clean existing tables if present
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

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image, active, sort_order) VALUES
('cat-cakes', 'Cakes', 'cakes', 'Beautiful handcrafted cakes for birthdays, celebrations and special occasions.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', TRUE, 1),
('cat-small-chops', 'Small Chops', 'small-chops', 'Crispy spring rolls, samosas, puff puff, mosa, and finger foods for parties and snacking.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', TRUE, 2),
('cat-snacks', 'Snacks', 'snacks', 'Flaky meat pies, sausage rolls, chicken pies, scotch eggs, and daily pastries.', 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=600&q=80', TRUE, 3),
('cat-drinks', 'Drinks', 'drinks', 'Chilled natural Zobo drink, signature Chapman, citrus blends, and refreshing beverages.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', TRUE, 4),
('cat-yoghurt', 'Yoghurt', 'yoghurt', 'Rich, creamy, sweetened and unsweetened probiotic artisan yoghurts.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', TRUE, 5),
('cat-fruit-parfait', 'Fruit Parfait', 'fruit-parfait', 'Layers of fresh tropical fruits, greek yoghurt, crunchy granola, and honey drizzle.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', TRUE, 6),
('cat-soups', 'Soups', 'soups', 'Authentic Nigerian soups: Egusi, Banga, Afang, Seafood Okro, and Rich Stew.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80', TRUE, 7),
('cat-african-dishes', 'African Dishes', 'african-dishes', 'Smoky Party Jollof Rice, Fried Rice, Asun, Pounded Yam, and native delicacies.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', TRUE, 8),
('cat-shawarma', 'Shawarma', 'shawarma', 'Juicy grilled beef, chicken, or combo shawarma wrapped in freshly baked pita.', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80', TRUE, 9),
('cat-pizza', 'Pizza', 'pizza', 'Stone-baked pizzas loaded with gooey cheese, savoury chicken, and Nigerian suya toppings.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', TRUE, 10);

-- ----------------------------------------------------------
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

-- Insert Products
INSERT INTO products (id, name, slug, category_id, category_name, price, discount_price, short_description, description, image, gallery, sku, stock, track_inventory, featured, active, rating, reviews_count, ingredients, allergens, preparation_time) VALUES
('prod-red-velvet-cake', 'Classic Red Velvet Celebration Cake', 'classic-red-velvet-cake', 'cat-cakes', 'Cakes', 18000.00, 16500.00, 'Ultra-moist red velvet layers infused with cocoa and topped with silky cream cheese frosting.', 'Indulge in our signature Red Velvet Cake, baked fresh to perfection using premium Belgian cocoa, rich butter, and pure vanilla extract.', 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-CK-001', 15, TRUE, TRUE, TRUE, 4.90, 28, 'Wheat flour, Dutch cocoa, buttermilk, farm eggs, cream cheese, unsalted butter, pure vanilla, sugar.', 'Contains Gluten, Dairy, Eggs.', '3 - 5 Hours (Pre-order available)'),
('prod-rich-chocolate-fudge-cake', 'Decadent Chocolate Fudge Cake', 'rich-chocolate-fudge-cake', 'cat-cakes', 'Cakes', 19000.00, NULL, 'Triple chocolate sponge loaded with rich chocolate ganache and chocolate drips.', 'A chocolate lover''s ultimate dream! Three layers of decadent, dark chocolate sponge drenched in chocolate syrup.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-CK-002', 12, TRUE, TRUE, TRUE, 4.80, 19, 'Dark chocolate, cocoa powder, butter, eggs, flour, chocolate ganache.', 'Contains Dairy, Gluten, Eggs.', '4 Hours'),
('prod-vip-small-chops-platter', 'VIP Party Small Chops Platter', 'vip-party-small-chops-platter', 'cat-small-chops', 'Small Chops', 6500.00, 5500.00, 'Platter containing Spring Rolls, Samosas, Puff Puff, Plantain Mosa, and Peppered Gizzard.', 'The life of every Nigerian party! Our famous Small Chops platter is freshly fried upon order.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SC-001', 45, TRUE, TRUE, TRUE, 5.00, 64, 'Spring roll pastry, minced beef, sweet plantain, flour, yeast, pepper sauce, gizzard.', 'Contains Gluten.', '30 - 45 Minutes'),
('prod-crispy-spring-rolls-pack', 'Crispy Beef & Veggie Spring Rolls (10 pcs)', 'crispy-spring-rolls-pack', 'cat-small-chops', 'Small Chops', 3500.00, NULL, '10 pieces of ultra-crispy spring rolls filled with seasoned beef, cabbage, and carrots.', 'Golden crispy wrappers filled with seasoned shredded cabbage, sweet carrots, and seasoned minced beef.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SC-002', 30, TRUE, FALSE, TRUE, 4.70, 14, 'Flour wrap, seasoned cabbage, carrots, minced beef, garlic, ginger, vegetable oil.', 'Contains Gluten.', '25 Minutes'),
('prod-flaky-nigerian-meat-pie', 'Glozzy Signature Nigerian Meat Pie', 'flaky-nigerian-meat-pie', 'cat-snacks', 'Snacks', 1200.00, 1000.00, 'Flaky, buttery golden pastry stuffed with juicy minced beef, diced potatoes and carrots.', 'Made with genuine Nigerian baker expertise: crisp, melt-in-the-mouth buttery pastry packed to the brim with well-seasoned beef.', 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SN-001', 50, TRUE, TRUE, TRUE, 4.90, 42, 'Wheat flour, pure butter, seasoned minced beef, potatoes, carrots, onions, spices.', 'Contains Gluten, Dairy.', 'Ready to Eat / 15 Minutes'),
('prod-golden-scotch-egg', 'Golden Jumbo Scotch Egg', 'golden-jumbo-scotch-egg', 'cat-snacks', 'Snacks', 1500.00, NULL, 'Boiled farm egg wrapped in seasoned sausage meat and deep-fried in golden breadcrumbs.', 'A classic favourite! Whole fresh boiled egg encased in seasoned, savory sausage meat, coated in crisp panko breadcrumbs.', 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SN-002', 25, TRUE, FALSE, TRUE, 4.80, 11, 'Whole farm egg, sausage meat, nutmeg, breadcrumbs, vegetable oil.', 'Contains Eggs, Gluten.', 'Ready to Eat'),
('prod-natural-hibiscus-zobo', 'Chilled Natural Spiced Zobo Drink', 'natural-spiced-zobo-drink', 'cat-drinks', 'Drinks', 1500.00, 1200.00, '100% natural hibiscus flower drink infused with ginger, cloves, pineapple juice and citrus.', 'Refreshing, healthy, and antioxidant-rich! Our signature Zobo is slow-brewed from organic hibiscus petals and real pineapples.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-DK-001', 60, TRUE, TRUE, TRUE, 5.00, 57, 'Dried Hibiscus sabdariffa petals, fresh ginger, cloves, fresh pineapple extract, lemon, mint.', 'None', 'Ready Chilled'),
('prod-nigerian-chapman-signature', 'Glozzy Signature Chapman Cocktail', 'nigerian-chapman-signature', 'cat-drinks', 'Drinks', 2500.00, 2000.00, 'The iconic Nigerian Chapman with Angostura bitters, Fanta, Sprite, Ribena and fresh cucumbers/citrus.', 'Nigeria''s favourite mocktail! A tantalising blend of citrus sodas, pomegranate/Ribena nectar, and aromatic bitters.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-DK-002', 35, TRUE, TRUE, TRUE, 4.90, 22, 'Fanta, Sprite, Ribena, Angostura bitters, fresh cucumber, orange, lemon.', 'None', '10 Minutes'),
('prod-creamy-artisan-yoghurt', 'Artisan Sweetened Drinking Yoghurt', 'artisan-sweetened-drinking-yoghurt', 'cat-yoghurt', 'Yoghurt', 2000.00, NULL, 'Silky smooth, rich, and probiotic-rich sweetened cow milk yoghurt.', 'Carefully fermented using fresh whole cow milk and active live cultures for supreme gut health and unbeatable taste.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-YG-001', 40, TRUE, FALSE, TRUE, 4.80, 16, 'Pasteurised whole milk, live probiotic cultures, sucrose, natural vanilla.', 'Contains Dairy.', 'Ready to Drink'),
('prod-classic-fruit-parfait', 'Classic Glozzy Fruit Parfait', 'classic-glozzy-fruit-parfait', 'cat-fruit-parfait', 'Fruit Parfait', 4500.00, 4000.00, 'Layers of creamy yoghurt, fresh strawberries, apples, grapes, bananas, crunchy granola and honey.', 'Freshly prepared upon your order! Layered with thick premium greek yoghurt, juicy fresh fruits, granola, and honey.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-FP-001', 35, TRUE, TRUE, TRUE, 4.90, 51, 'Greek yoghurt, strawberries, apples, grapes, bananas, oats granola, almond flakes, honey.', 'Contains Dairy, Nuts.', '15 - 20 Minutes'),
('prod-special-egusi-soup-bowl', 'Special Egusi Soup (Elegusi) with Assorted Meat & Fish', 'special-egusi-soup-bowl', 'cat-soups', 'Soups', 8500.00, 7500.00, 'Rich melon seed soup with spinach/ugwu, stockfish, dried fish, kpomo, and assorted beef.', 'Authentic, hearty Nigerian Egusi soup slow-cooked in rich palm oil broth with grounded melon seeds and assorted meats.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SP-001', 20, TRUE, TRUE, TRUE, 5.00, 38, 'Melon seeds (Egusi), palm oil, stockfish, smoked fish, beef, shaki, kpomo, ugwu leaves, crayfish.', 'Contains Fish, Shellfish (Crayfish).', '45 Minutes'),
('prod-delta-banga-soup', 'Authentic Delta Banga Soup (Oghwo Amiedi)', 'authentic-delta-banga-soup', 'cat-soups', 'Soups', 9000.00, NULL, 'Rich palm fruit extract soup spiced with beletete, oburunbebe stick, catfish and beef.', 'Direct from the heart of the Niger Delta! Made from freshly extracted palm nut cream and authentic Banga spices.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SP-002', 15, TRUE, TRUE, TRUE, 4.90, 24, 'Palm fruit nut extract, banga spices, beletete leaves, fresh fish, assorted beef, crayfish.', 'Contains Fish, Shellfish (Crayfish).', '50 Minutes'),
('prod-smoky-party-jollof-combo', 'Smoky Nigerian Party Jollof Rice Combo', 'smoky-nigerian-party-jollof-rice-combo', 'cat-african-dishes', 'African Dishes', 5000.00, 4200.00, 'Firewood-infused smoky party jollof rice served with fried plantain (dodo), salad and peppered chicken.', 'Nothing beats authentic Nigerian firewood party Jollof! Long grain rice cooked in roasted bell pepper reduction.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-AD-001', 40, TRUE, TRUE, TRUE, 5.00, 89, 'Long grain parboiled rice, bell peppers, scotch bonnet, tomato plum, spices, chicken, plantain.', 'None.', '25 - 35 Minutes'),
('prod-special-fried-rice-platter', 'Special Nigerian Fried Rice & Chicken', 'special-nigerian-fried-rice-chicken', 'cat-african-dishes', 'African Dishes', 4500.00, NULL, 'Aromatic basmati fried rice with sweet corn, green peas, liver bits, and jumbo grilled chicken.', 'Fluffy seasoned rice stir-fried in rich chicken stock with green peas, sweet corn, carrots, and spicy chicken.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-AD-002', 30, TRUE, FALSE, TRUE, 4.80, 31, 'Basmati rice, curry, thyme, green peas, carrots, sweet corn, chicken broth, chicken.', 'None.', '30 Minutes'),
('prod-double-sausage-beef-shawarma', 'Double Sausage Deluxe Beef Shawarma', 'double-sausage-deluxe-beef-shawarma', 'cat-shawarma', 'Shawarma', 3500.00, 3000.00, 'Tender shredded grilled beef, 2 jumbo beef sausages, cabbage, creamy special cream in pita wrap.', 'Juicy, well-marinated beef grilled to tenderness, tossed with crisp cabbage and two juicy beef sausages.', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-SH-001', 35, TRUE, TRUE, TRUE, 4.90, 45, 'Pita flatbread, shredded beef, sausage, cabbage, mayonnaise, ketchup, chili pepper.', 'Contains Gluten, Eggs (Mayonnaise).', '20 Minutes'),
('prod-nigerian-suya-loaded-pizza', 'Spicy Beef Suya Loaded Pizza', 'spicy-beef-suya-loaded-pizza', 'cat-pizza', 'Pizza', 7500.00, 6500.00, 'Crisp hand-tossed dough topped with authentic spicy beef suya, mozzarella, bell peppers and onions.', 'Handcrafted pizza crust topped with rich tomato sauce, melted mozzarella cheese, and smoky Nigerian beef suya.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'GLZ-PZ-001', 20, TRUE, TRUE, TRUE, 4.90, 29, 'Pizza dough, mozzarella, spicy beef suya, yaji pepper, tomato marinara, bell peppers, onions.', 'Contains Gluten, Dairy, Peanuts (Yaji).', '30 - 40 Minutes');

-- ----------------------------------------------------------
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

-- Insert Product Variants
INSERT INTO product_variants (id, product_id, name, value, price, stock) VALUES
('v-rv-6', 'prod-red-velvet-cake', 'Size', '6 Inch (Serves 6-8)', 16500.00, 8),
('v-rv-8', 'prod-red-velvet-cake', 'Size', '8 Inch (Serves 12-16)', 24000.00, 5),
('v-rv-10', 'prod-red-velvet-cake', 'Size', '10 Inch (Serves 20-25)', 35000.00, 2),
('v-cf-6', 'prod-rich-chocolate-fudge-cake', 'Size', '6 Inch', 19000.00, 6),
('v-cf-8', 'prod-rich-chocolate-fudge-cake', 'Size', '8 Inch', 26000.00, 4),
('v-cf-10', 'prod-rich-chocolate-fudge-cake', 'Size', '10 Inch', 38000.00, 2),
('v-sc-solo', 'prod-vip-small-chops-platter', 'Portion', 'Solo Pack (15 Pieces)', 5500.00, 25),
('v-sc-double', 'prod-vip-small-chops-platter', 'Portion', 'Duet Pack (30 Pieces)', 10500.00, 15),
('v-sc-mega', 'prod-vip-small-chops-platter', 'Portion', 'Party Pack (60 Pieces)', 19500.00, 8),
('v-mp-single', 'prod-flaky-nigerian-meat-pie', 'Quantity', 'Single Meat Pie', 1000.00, 50),
('v-mp-box4', 'prod-flaky-nigerian-meat-pie', 'Quantity', 'Box of 4 Meat Pies', 3800.00, 20),
('v-mp-box10', 'prod-flaky-nigerian-meat-pie', 'Quantity', 'Family Box (10 Meat Pies)', 9000.00, 10),
('v-zb-35', 'prod-natural-hibiscus-zobo', 'Bottle Size', '35cl Bottle', 1200.00, 40),
('v-zb-50', 'prod-natural-hibiscus-zobo', 'Bottle Size', '50cl Bottle', 1800.00, 30),
('v-zb-100', 'prod-natural-hibiscus-zobo', 'Bottle Size', '1 Litre Jug', 3200.00, 15),
('v-ch-cup', 'prod-nigerian-chapman-signature', 'Size', '500ml Cup', 2000.00, 25),
('v-ch-jug', 'prod-nigerian-chapman-signature', 'Size', '1.5L Pitcher', 5500.00, 10),
('v-yg-50', 'prod-creamy-artisan-yoghurt', 'Size', '500ml Bottle', 2000.00, 25),
('v-yg-100', 'prod-creamy-artisan-yoghurt', 'Size', '1 Litre Bottle', 3800.00, 15),
('v-fp-sm', 'prod-classic-fruit-parfait', 'Cup Size', 'Small (350ml)', 3000.00, 20),
('v-fp-med', 'prod-classic-fruit-parfait', 'Cup Size', 'Medium (500ml)', 4000.00, 25),
('v-fp-lg', 'prod-classic-fruit-parfait', 'Cup Size', 'Large (750ml)', 5500.00, 15),
('v-eg-1l', 'prod-special-egusi-soup-bowl', 'Bowl Size', '1 Litre Bowl', 7500.00, 12),
('v-eg-2l', 'prod-special-egusi-soup-bowl', 'Bowl Size', '2 Litre Bowl', 14000.00, 8),
('v-eg-3l', 'prod-special-egusi-soup-bowl', 'Bowl Size', '3 Litre Family Bowl', 20000.00, 5),
('v-bg-1l', 'prod-delta-banga-soup', 'Bowl Size', '1 Litre Bowl', 9000.00, 10),
('v-bg-2l', 'prod-delta-banga-soup', 'Bowl Size', '2 Litre Bowl', 17000.00, 6),
('v-jr-chk', 'prod-smoky-party-jollof-combo', 'Protein', 'With Peppered Chicken', 4200.00, 25),
('v-jr-beef', 'prod-smoky-party-jollof-combo', 'Protein', 'With Peppered Beef / Asun', 4500.00, 20),
('v-jr-fish', 'prod-smoky-party-jollof-combo', 'Protein', 'With Croaker / Catfish', 5200.00, 10),
('v-sh-beef', 'prod-double-sausage-beef-shawarma', 'Filling', 'Shredded Beef + 2 Sausages', 3000.00, 20),
('v-sh-chk', 'prod-double-sausage-beef-shawarma', 'Filling', 'Grilled Chicken + 2 Sausages', 3200.00, 15),
('v-sh-mixed', 'prod-double-sausage-beef-shawarma', 'Filling', 'Combo (Beef + Chicken + 2 Sausages + Cheese)', 4200.00, 10),
('v-pz-med', 'prod-nigerian-suya-loaded-pizza', 'Size', 'Medium (10 Inch - 6 Slices)', 6500.00, 12),
('v-pz-lg', 'prod-nigerian-suya-loaded-pizza', 'Size', 'Large (12 Inch - 8 Slices)', 9000.00, 8),
('v-pz-xl', 'prod-nigerian-suya-loaded-pizza', 'Size', 'Jumbo XL (14 Inch - 10 Slices)', 12000.00, 5);

-- ----------------------------------------------------------
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

-- Insert Delivery Zones
INSERT INTO delivery_zones (id, name, fee, estimated_time, description, active) VALUES
('zone-1', 'Benin City — Zone 1 (GRA, Airport Road, Boundary)', 1500.00, '25 - 40 mins', 'Fast delivery to GRA, Airport Road, Boundary and immediate neighborhoods.', TRUE),
('zone-2', 'Benin City — Zone 2 (Ugbowo, Ring Road, Siluko, Ekehuan)', 2000.00, '35 - 55 mins', 'Doorstep delivery to Ugbowo, Ring Road, Siluko, Ekehuan and environs.', TRUE),
('zone-3', 'Benin City — Zone 3 (Ikpoba Hill, Aduwawa, Upper Sakponba)', 2500.00, '45 - 65 mins', 'Delivery to Ikpoba Hill, Aduwawa, Upper Sakponba, bypass and outskirt areas.', TRUE),
('zone-express', 'Express Priority Citywide Delivery', 3500.00, '20 - 30 mins', 'VIP instant dispatch rider assigned solely to your order.', TRUE);

-- ----------------------------------------------------------
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

-- Insert Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, expiry_date, usage_limit, used_count, active) VALUES
('cp-1', 'GLOZZY10', 'percentage', 10.00, 15000.00, 5000.00, '2026-12-31', 500, 42, TRUE),
('cp-2', 'WELCOME5', 'fixed', 500.00, 5000.00, 500.00, '2026-12-31', 1000, 128, TRUE),
('cp-3', 'TASTY20', 'percentage', 20.00, 25000.00, 8000.00, '2026-12-31', 100, 15, TRUE);

-- ----------------------------------------------------------
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

-- Insert Orders
INSERT INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, delivery_zone_id, delivery_zone_name, delivery_fee, order_notes, subtotal, discount_amount, grand_total, payment_method, payment_status, order_status, coupon_code, items_json, created_at) VALUES
('order-101', 'Osasere Ighodaro', 'osas.ighodaro@gmail.com', '+234 802 345 6789', '14 Reservation Road, GRA, Benin City', 'zone-1', 'Benin City — Zone 1 (GRA, Airport Road, Boundary)', 1500.00, 'Please make the small chops extra crispy.', 14600.00, 0.00, 16100.00, 'Paystack', 'Paid', 'Out for Delivery', NULL, '[{"productId":"prod-vip-small-chops-platter","productName":"VIP Party Small Chops Platter","price":5500,"quantity":2},{"productId":"prod-natural-hibiscus-zobo","productName":"Chilled Natural Spiced Zobo Drink","price":1800,"quantity":2}]'::jsonb, '2026-08-15T13:45:00.000Z'),
('order-102', 'Amina Bello', 'amina.bello@yahoo.com', '+234 813 987 6543', 'Block 4, Ugbowo Housing Estate, Benin City', 'zone-2', 'Benin City — Zone 2 (Ugbowo, Ring Road, Siluko, Ekehuan)', 2000.00, 'Write Happy 25th Birthday Amina on the cake board.', 29500.00, 2950.00, 28550.00, 'Paystack', 'Paid', 'Preparing', 'GLOZZY10', '[{"productId":"prod-red-velvet-cake","productName":"Classic Red Velvet Celebration Cake","price":24000,"quantity":1},{"productId":"prod-classic-fruit-parfait","productName":"Classic Glozzy Fruit Parfait","price":5500,"quantity":1}]'::jsonb, '2026-08-15T14:30:00.000Z');

-- ----------------------------------------------------------
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

-- Insert Reviews
INSERT INTO reviews (id, product_id, customer_name, rating, comment, approved, created_at) VALUES
('rev-1', 'prod-red-velvet-cake', 'Blessing Enoma', 5, 'The red velvet cake was so soft and fresh! It made my daughter''s birthday unforgettable. Everyone was asking where we got it from.', TRUE, '2026-08-10T10:00:00.000Z'),
('rev-2', 'prod-vip-small-chops-platter', 'Kenneth Adeleke', 5, 'Best small chops in Benin City! The samosa had plenty meat and the spring rolls were extra crispy even on delivery.', TRUE, '2026-08-12T14:20:00.000Z'),
('rev-3', 'prod-classic-fruit-parfait', 'Eunice O.', 5, 'The fruit parfait is so rich and fresh, very healthy and satisfying. Ordering again this weekend!', TRUE, '2026-08-14T09:15:00.000Z');

-- ----------------------------------------------------------
-- 8. Table structure for cms_settings
-- ----------------------------------------------------------
CREATE TABLE cms_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(128) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL
);

-- Insert CMS Settings
INSERT INTO cms_settings (setting_key, setting_value) VALUES
('store_config', '{"hero":{"tagline":"Authentic Nigerian Dishes & Handcrafted Confectioneries","title":"Great Food. Great Taste. Every Time.","highlightText":"GlozzyFoods ND More","description":"Fresh African dishes, delicious confectionery cakes, crispy small chops, refreshing chilled drinks and artisan fruit parfaits made with passion and love.","primaryCtaText":"Order Online Now","secondaryCtaText":"Explore Full Menu","bannerImage":"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80"},"topbarNotice":"🔥 Same-Day Fast Food Delivery in Benin City & Custom Event Catering! Call / WhatsApp: +234 703 551 8331","promoBanner":{"title":"Get 10% Discount on Orders Above ₦15,000!","code":"GLOZZY10","subtitle":"Use coupon code at checkout or mention it when ordering via WhatsApp.","image":"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"},"storeContact":{"brandName":"GLOZZYFOODS","subBrand":"ND MORE","phone":"+234 703 551 8331","whatsapp":"2347035518331","email":"orders@glozzyfoods.com","hours":"Monday – Saturday: 8:00 AM – 9:00 PM | Sunday: 11:00 AM – 7:00 PM","address":"Benin City, Edo State, Nigeria","freeDeliveryThreshold":30000,"bankDetails":{"bankName":"Zenith Bank","accountNumber":"1018849201","accountName":"GLOZZYFOODS ND MORE"}}}'::jsonb);
