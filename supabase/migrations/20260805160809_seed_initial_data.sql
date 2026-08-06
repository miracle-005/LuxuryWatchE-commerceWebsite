/*
# Seed initial products, banners, and campaigns

## Overview
Inserts the 12 luxury watch products, 2 homepage banners, and 2 promotional campaigns
that ship as the default catalog. These match the original mock data.

## Data
- 12 products (Noir Eclipse, Chronos Royale, Storm Pro X, etc.)
- 2 homepage banners
- 2 promotional campaigns
*/

INSERT INTO products (name, brand, category, price, original_price, image, images, rating, reviews, stock, is_new, is_best_seller, is_featured, description, specs, colors, discount)
VALUES
('Noir Eclipse', 'Autem', 'Luxury', 4850, 5200,
 'https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1618215650148-e8e61eae521c?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1773414753637-2738750cfbb6?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.9, 124, 6, false, true, true,
 'The Noir Eclipse is our most audacious statement in horology. Crafted from grade-5 titanium with a deep black PVD coating, this timepiece exudes understated authority. The in-house movement beats at 28,800 vph with a 72-hour power reserve.',
 '{"Case Material": "Grade-5 Titanium PVD", "Case Size": "42mm", "Movement": "Automatic, In-house", "Water Resistance": "200m", "Power Reserve": "72 hours", "Crystal": "Sapphire AR-coated", "Strap": "Alligator leather"}'::jsonb,
 '["#1a1a1a", "#c9a050"]'::jsonb, 7),

('Chronos Royale', 'Meridian', 'Luxury', 6200, 6200,
 'https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.8, 89, 3, true, false, true,
 'The Chronos Royale represents the pinnacle of Swiss watchmaking tradition. Featuring a hand-guilloché dial in champagne gold, this masterpiece is powered by a skeletonized tourbillon movement visible through the exhibition caseback.',
 '{"Case Material": "18K Rose Gold", "Case Size": "40mm", "Movement": "Manual-wind Tourbillon", "Water Resistance": "50m", "Power Reserve": "120 hours", "Crystal": "Sapphire double-sided AR", "Strap": "Ostrich leather"}'::jsonb,
 '["#c9a050", "#f5e6c8"]'::jsonb, 0),

('Storm Pro X', 'Vertex', 'Sports', 1850, 2100,
 'https://images.unsplash.com/photo-1758887952896-8491d393afe2?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1758887952896-8491d393afe2?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1766229967495-001ff77d750b?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.6, 312, 24, false, true, true,
 'Built for extremes. The Storm Pro X features a helium escape valve, unidirectional rotating bezel, and a proprietary shock-absorbing case construction. Trusted by professional divers and mountaineers worldwide.',
 '{"Case Material": "Stainless Steel 316L", "Case Size": "44mm", "Movement": "Automatic", "Water Resistance": "500m", "Power Reserve": "48 hours", "Crystal": "Sapphire mineral composite", "Strap": "Rubber + steel bracelet"}'::jsonb,
 '["#2d2d2d", "#1a3a5c", "#4a1a1a"]'::jsonb, 12),

('Nova Smart Elite', 'Nexus', 'Smart', 899, 1099,
 'https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1730757679771-b53e798846cf?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1773414753637-2738750cfbb6?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.4, 567, 42, true, true, false,
 'Where technology meets elegance. The Nova Smart Elite monitors your health metrics, tracks fitness, displays notifications, and makes contactless payments — all wrapped in a premium sapphire glass housing with ceramic bezel.',
 '{"Case Material": "Ceramic + Aluminium", "Case Size": "41mm", "Display": "AMOLED 1.8\"", "Battery": "72 hours", "Water Resistance": "100m", "Sensors": "ECG, SpO2, GPS", "OS": "Proprietary WatchOS"}'::jsonb,
 '["#1a1a1a", "#c0c0c0", "#c9a050"]'::jsonb, 18),

('Cascade Urban', 'Cascade', 'Casual', 395, 395,
 'https://images.unsplash.com/photo-1771734038750-ff6269568e38?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1771734038750-ff6269568e38?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1771734038899-f8c42dbc800f?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.3, 203, 55, false, false, false,
 'Effortless everyday elegance. The Cascade Urban''s minimalist dial paired with interchangeable straps makes it the perfect companion from morning meetings to weekend outings. Powered by a Japanese quartz movement.',
 '{"Case Material": "Stainless Steel", "Case Size": "38mm", "Movement": "Japanese Quartz", "Water Resistance": "50m", "Battery": "3 years", "Crystal": "Mineral glass", "Strap": "Interchangeable leather/nylon"}'::jsonb,
 '["#c0c0c0", "#c9a050", "#8b7355"]'::jsonb, 0),

('Soleil Rose', 'Autem', 'Luxury', 3200, 3600,
 'https://images.unsplash.com/photo-1760532467609-45ed8016f795?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1760532467609-45ed8016f795?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.7, 76, 9, true, false, true,
 'The Soleil Rose is femininity distilled into horology. Set with 48 pavé diamonds around the bezel and featuring a mother-of-pearl dial with rose gold indices, this watch is as much jewelry as it is timepiece.',
 '{"Case Material": "18K Rose Gold", "Case Size": "36mm", "Movement": "Automatic", "Water Resistance": "30m", "Diamonds": "0.38ct pavé bezel", "Crystal": "Sapphire AR-coated", "Strap": "Satin with butterfly clasp"}'::jsonb,
 '["#f5c6a0", "#c9a050"]'::jsonb, 11),

('Titan Storm', 'Vertex', 'Sports', 2100, 2100,
 'https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600&h=600&fit=crop&auto=format","https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.5, 188, 17, false, false, false,
 'The Titan Storm is a pilot''s companion for the modern era. Featuring a bidirectional slide rule bezel, GMT complication, and a case crafted from aerospace-grade titanium, it combines technical excellence with refined styling.',
 '{"Case Material": "Aerospace Titanium", "Case Size": "43mm", "Movement": "Automatic GMT", "Water Resistance": "200m", "Power Reserve": "60 hours", "Crystal": "Flat sapphire", "Strap": "Titanium bracelet"}'::jsonb,
 '["#808080", "#1a1a1a"]'::jsonb, 0),

('Apex Smart Pro', 'Nexus', 'Smart', 1249, 1499,
 'https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1662333084914-3eea84762671?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.2, 429, 31, true, false, false,
 'The Apex Smart Pro combines premium materials with cutting-edge technology. Featuring a titanium case, always-on display, and a week-long battery life, it sets a new benchmark for luxury smartwatches.',
 '{"Case Material": "Grade 5 Titanium", "Case Size": "45mm", "Display": "LTPO AMOLED", "Battery": "7 days", "Water Resistance": "100m", "Sensors": "ECG, SpO2, EDA, GPS", "Connectivity": "LTE + WiFi"}'::jsonb,
 '["#808080", "#1a1a1a", "#2d4a2d"]'::jsonb, 17),

('Heritage Bronze', 'Meridian', 'Casual', 680, 750,
 'https://images.unsplash.com/photo-1772949399884-01ec45bc5763?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1772949399884-01ec45bc5763?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.4, 97, 28, false, false, false,
 'A tribute to the golden age of watchmaking, the Heritage Bronze develops a unique patina over time — making every watch one-of-a-kind. Powered by a reliable Swiss automatic movement with a display caseback.',
 '{"Case Material": "CuSn8 Bronze", "Case Size": "40mm", "Movement": "Swiss Automatic", "Water Resistance": "100m", "Power Reserve": "42 hours", "Crystal": "Domed sapphire", "Strap": "Vegetable-tanned leather"}'::jsonb,
 '["#8b6914", "#5a4010"]'::jsonb, 9),

('Pacific Diver', 'Vertex', 'Sports', 1580, 1580,
 'https://images.unsplash.com/photo-1767779228363-21e8816c7147?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1767779228363-21e8816c7147?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.6, 241, 19, false, true, false,
 'ISO 6425 certified and pressure tested to 1000m, the Pacific Diver is the ultimate tool watch. Anti-magnetic construction, a maxi-luminous dial, and screw-down crown make it the professional diver''s first choice.',
 '{"Case Material": "Stainless Steel 316L", "Case Size": "42mm", "Movement": "Automatic", "Water Resistance": "1000m", "Power Reserve": "48 hours", "Crystal": "Sapphire Cyclops", "Certification": "ISO 6425"}'::jsonb,
 '["#1a3a5c", "#2d2d2d", "#2d4a2d"]'::jsonb, 0),

('Elara Moonphase', 'Autem', 'Luxury', 5400, 5400,
 'https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.9, 54, 5, true, false, true,
 'The Elara Moonphase is a celestial complication wrapped in earthly beauty. Featuring a hand-painted lunar disk, aventurine dial, and platinum case, it tracks the moon''s phases with astronomical precision.',
 '{"Case Material": "Platinum 950", "Case Size": "39mm", "Movement": "Automatic Moonphase", "Water Resistance": "50m", "Power Reserve": "96 hours", "Crystal": "Sapphire AR-coated", "Dial": "Aventurine"}'::jsonb,
 '["#1a1a3a", "#c9a050"]'::jsonb, 0),

('Urban Classic', 'Cascade', 'Casual', 590, 650,
 'https://images.unsplash.com/photo-1771734038899-f8c42dbc800f?w=600&h=600&fit=crop&auto=format',
 '["https://images.unsplash.com/photo-1771734038899-f8c42dbc800f?w=600&h=600&fit=crop&auto=format"]'::jsonb,
 4.5, 156, 38, false, true, false,
 'The Urban Classic is the versatile dress watch every collection needs. Clean baton indices, a sunburst dial, and a slim profile make it equally at home with a suit or smart-casual attire.',
 '{"Case Material": "Stainless Steel", "Case Size": "40mm", "Movement": "Automatic", "Water Resistance": "50m", "Power Reserve": "42 hours", "Crystal": "Sapphire", "Strap": "Leather"}'::jsonb,
 '["#c0c0c0", "#1a1a1a", "#8b7355"]'::jsonb, 9)
ON CONFLICT DO NOTHING;

-- ─── Banners ──────────────────────────────────────────────────────────────────

INSERT INTO banners (title, subtitle, image_url, cta_text, link, active, position)
VALUES
('The Art of Time', 'Discover our curated collection of luxury timepieces, where heritage meets innovation.',
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=900&fit=crop&auto=format',
 'Explore Collection', 'shop', true, 0),

('New Season Arrivals', 'Experience the latest masterpieces from the world''s finest watchmakers.',
 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&h=900&fit=crop&auto=format',
 'Discover More', 'newArrivals', true, 1)
ON CONFLICT DO NOTHING;

-- ─── Campaigns ─────────────────────────────────────────────────────────────────

INSERT INTO campaigns (name, code, discount, start_date, end_date, active)
VALUES
('Summer Sale', 'SUMMER15', '15%', '2025-06-01', '2025-08-31', true),
('New Customer Offer', 'WELCOME10', '10%', '2025-01-01', '2025-12-31', true)
ON CONFLICT DO NOTHING;
