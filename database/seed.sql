-- ============================================================================
-- Get Jakes Cake Props & Toppers - Seed Data Script
-- ============================================================================

USE `getjakes_db`;

-- Seed Admin Users & Customers
INSERT INTO `users` (`full_name`, `email`, `password_hash`, `auth_provider`, `role`) VALUES
('Get Jakes Admin', 'admin@getjakes.com', '$2a$12$e0MYzXy8.hB4K5Yg.J/81.kX9O5G8d1cE8f0g1h2i3j4k5l6m7n8o', 'email', 'admin'),
('Invited Studio Manager', 'invited.admin@getjakes.com', NULL, 'email', 'admin'),
('Eleanor Vance', 'eleanor@chateauxevents.com', '$2a$12$e0MYzXy8.hB4K5Yg.J/81.kX9O5G8d1cE8f0g1h2i3j4k5l6m7n8o', 'email', 'customer'),
('Marcus Sterling', 'marcus@voguephotostudio.io', NULL, 'google', 'customer');

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
('wedding', 'Wedding Tier Dummies', 'wedding', 'Multi-tier faux wedding cake displays for ballrooms and showcases.'),
('photography', 'Studio Photo Kits', 'photography', 'Non-melting cake slices and props engineered for photography lighting.'),
('pedestal', 'Display Pedestals', 'pedestal', 'Architectural cylinder pedestals and fluted dessert table risers.'),
('custom', 'Custom & Commercial', 'custom', 'UV-protected large scale bakery window dummy installations.');

-- Seed Products
INSERT INTO `products` (`id`, `name`, `category_id`, `price`, `original_price`, `rating`, `reviews_count`, `image_url`, `tag`, `description`, `height_spec`, `tiers_spec`, `material_spec`, `weight_spec`) VALUES
('prop-01', 'Aurelia 4-Tier Luxury Wedding Cake Dummy', 'wedding', 389.00, 449.00, 4.90, 38, '/images/wedding_tier_prop.png', 'Bestseller', 'Hand-finished 4-tier wedding dummy cake with durable faux fondant coating, pearl trim, and sugar rose replicas.', '28 inches (71 cm)', '4 Tiers (6", 8", 10", 12")', 'High-Density EPS Foam + Polymer Fondant Coating', '4.2 lbs (Lightweight & Portable)'),
('prop-02', 'Ophelia Cyan & Gold Leaf Statement Prop', 'wedding', 279.00, NULL, 5.00, 24, '/images/hero_cake_prop.png', 'Handcrafted', 'Minimalist 3-tier organic textured white cake with authentic metallic leaf gilding and Get Jakes signature finish.', '22 inches (56 cm)', '3 Tiers (6", 8", 10")', 'Ultra-Hard Resin Compound Core', '3.8 lbs'),
('prop-03', 'Pastel Studio Food Photography Kit', 'photography', 145.00, 175.00, 4.80, 52, '/images/photo_prop_set.png', 'Studio Special', 'Set of 6 realistic faux cake slices, geometric acrylic blocks, and pastel dummy mini cakes.', 'Modular Set', '6-Piece Modular Props', 'Matte Non-Reflective Foam & Polymer', '2.1 lbs'),
('prop-04', 'Imperial Fluted Pedestal Display Set', 'pedestal', 215.00, NULL, 4.90, 19, '/images/pedestal_prop_set.png', 'Trending', 'Pair of ribbed architectural cylinder pedestals in warm plaster white and cyan-brushed accents.', '12" and 18" Elevated Risers', '10" Top Surface', 'Reinforced Fiber Composite', '60 lbs max load'),
('prop-05', 'Botanical Cascading Floral Dummy Cake', 'wedding', 320.00, NULL, 4.70, 15, '/images/wedding_tier_prop.png', 'New', '3-tier romantic dummy cake pre-decorated with artificial cascading sugar eucalyptus and garden roses.', '24 inches', '3 Tiers', 'Polymer Coated Core + Silk Floral Trim', '3.5 lbs'),
('prop-06', 'Commercial Bakery Window Display Dummy', 'custom', 495.00, 550.00, 5.00, 29, '/images/hero_cake_prop.png', 'Commercial Grade', '5-Tier grand display dummy designed specifically for bakery shop windows with UV protective coating.', '36 inches', '5 Tiers (6", 8", 10", 12", 14")', 'UV-Shield Polymer Compound', '7.0 lbs');

-- Seed Sample Orders
INSERT INTO `orders` (`id`, `order_ref_code`, `user_id`, `customer_name`, `customer_email`, `shipping_address`, `total_amount`, `payment_method`, `utr_number`, `status`, `admin_notes`) VALUES
(1, 'GJ-9842-PAY', 2, 'Eleanor Vance', 'eleanor@chateauxevents.com', '742 Evergreen Terrace, Suite 100, Chicago, IL 60601', 819.00, 'Direct Bank Transfer', 'UTR-994827103', 'Payment Verified', 'Bank payment received via wire. Order scheduled for studio packing.'),
(2, 'GJ-5109-PAY', 3, 'Marcus Sterling', 'marcus@voguephotostudio.io', '404 Fashion Boulevard, Studio 12, New York, NY 10018', 290.00, 'Direct Bank Transfer', 'Pending Wire Reference', 'Awaiting Bank Transfer Verification', 'Customer notified via email to attach transfer receipt.');

-- Seed Order Line Items
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `unit_price`, `quantity`, `image_url`) VALUES
(1, 'prop-01', 'Aurelia 4-Tier Luxury Wedding Cake Dummy', 389.00, 1, '/images/wedding_tier_prop.png'),
(1, 'prop-04', 'Imperial Fluted Pedestal Display Set', 215.00, 2, '/images/pedestal_prop_set.png'),
(2, 'prop-03', 'Pastel Studio Food Photography Kit', 145.00, 2, '/images/photo_prop_set.png');
