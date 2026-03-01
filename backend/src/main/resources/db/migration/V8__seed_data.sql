-- Age categories
INSERT INTO age_categories (id, label, min_months, max_months) VALUES
(1, 'Nyfødt (0-3 mnd)', 0, 3),
(2, 'Spedbarn (3-6 mnd)', 3, 6),
(3, 'Krabber (6-12 mnd)', 6, 12),
(4, 'Småbarn (1-2 år)', 12, 24);

-- Products
INSERT INTO products (id, name, description, image_url, condition) VALUES
(1,  'Babynest',          'Mykt og trygt babynest for de minste. Perfekt til soving og hvile.',                        'https://placehold.co/400x300?text=Babynest',          'NEW'),
(2,  'Stellematte',       'Praktisk sammenleggbar stellematte med polstring. Enkel å ta med seg.',                     'https://placehold.co/400x300?text=Stellematte',       'NEW'),
(3,  'Bæresele',          'Ergonomisk bæresele som gir god støtte for både baby og forelder.',                         'https://placehold.co/400x300?text=Baeresele',         'NEW'),
(4,  'Vognpose',          'Varm vognpose i vindtett materiale. Holder babyen varm på kalde dager.',                    'https://placehold.co/400x300?text=Vognpose',          'NEW'),
(5,  'Høystol',           'Justerbar høystol som vokser med barnet. Enkel å rengjøre.',                                'https://placehold.co/400x300?text=Hoystol',           'NEW'),
(6,  'Lekematte',         'Stor og myk lekematte med fine farger og mønster.',                                         'https://placehold.co/400x300?text=Lekematte',         'NEW'),
(7,  'Aktivitetsbue',     'Fargerik aktivitetsbue med hengende leker som stimulerer sansene.',                         'https://placehold.co/400x300?text=Aktivitetsbue',     'NEW'),
(8,  'Sikkerhetsgitter',  'Solid sikkerhetsgitter for trapp og dører. Enkel montering.',                               'https://placehold.co/400x300?text=Sikkerhetsgitter',  'NEW'),
(9,  'Krabbestativ',      'Stabilt krabbestativ som hjelper babyen å reise seg opp.',                                  'https://placehold.co/400x300?text=Krabbestativ',      'NEW'),
(10, 'Badestamp',         'Ergonomisk badestamp med sklisikker bunn. Passer fra nyfødt.',                               'https://placehold.co/400x300?text=Badestamp',         'NEW'),
(11, 'Sparkesykkel',      'Trehjuls sparkesykkel for småbarn. God balanse og stabil konstruksjon.',                    'https://placehold.co/400x300?text=Sparkesykkel',      'NEW'),
(12, 'Sengehest',         'Sammenleggbar sengehest som hindrer fall. Passer de fleste senger.',                        'https://placehold.co/400x300?text=Sengehest',         'NEW'),
(13, 'White noise-maskin', 'Beroligende white noise-maskin med flere lydvalg. Hjelper babyen å sove.',                 'https://placehold.co/400x300?text=WhiteNoise',        'NEW'),
(14, 'Blackout-gardin',   'Effektiv blackout-gardin med sugekopper. Perfekt for barnerommet.',                         'https://placehold.co/400x300?text=BlackoutGardin',    'NEW'),
(15, 'Reiseseng',         'Lett og sammenleggbar reiseseng med madrass. Enkel å transportere.',                        'https://placehold.co/400x300?text=Reiseseng',         'NEW'),
(16, 'Ammepute',          'Støttende ammepute med avtagbart trekk. Gir god støtte under amming.',                      'https://placehold.co/400x300?text=Ammepute',          'NEW'),
(17, 'Brystpumpe',        'Elektrisk brystpumpe med flere innstillinger. Stille og effektiv.',                         'https://placehold.co/400x300?text=Brystpumpe',        'NEW'),
(18, 'Bæremeis',          'Robust bæremeis for turer i naturen. Justerbar og komfortabel.',                            'https://placehold.co/400x300?text=Baeremeis',         'NEW'),
(19, 'Joggevogn',         'Sporty joggevogn med gode fjæringer. Perfekt for aktive foreldre.',                         'https://placehold.co/400x300?text=Joggevogn',         'NEW'),
(20, 'Allværsdress',      'Vanntett allværsdress for småbarn. Puster godt og tåler hard bruk.',                        'https://placehold.co/400x300?text=Allvaersdress',     'NEW');

-- Base packages (one per age category)
INSERT INTO packages (id, name, description, type, age_category_id, monthly_price, challenge_tag) VALUES
(1, 'Nyfødtpakken',   'Alt du trenger til den nyfødte. Babynest, stellematte, bæresele og mer.',                      'BASE', 1, 399.00, NULL),
(2, 'Spedbarnspakken', 'Utstyr tilpasset spedbarn 3-6 måneder. Aktivitetsbue, lekematte og vognpose.',                'BASE', 2, 349.00, NULL),
(3, 'Krabbepakken',   'For den aktive babyen som begynner å krabbe. Sikkerhet og stimulering.',                        'BASE', 3, 449.00, NULL),
(4, 'Småbarnspakken', 'Utstyr for småbarn 1-2 år. Sparkesykkel, høystol og allværsdress.',                            'BASE', 4, 499.00, NULL);

-- Addon packages
INSERT INTO packages (id, name, description, type, age_category_id, monthly_price, challenge_tag) VALUES
(5, 'Søvnpakken',     'Hjelp babyen å sove bedre. White noise-maskin, blackout-gardin og sengehest.',                 'ADDON', NULL, 199.00, 'sleep'),
(6, 'Reisepakken',    'Alt for reise med barn. Reiseseng, bæremeis og sammenleggbar stellematte.',                     'ADDON', NULL, 249.00, 'travel'),
(7, 'Ammepakken',     'Støtte til amming. Ammepute, brystpumpe og beroligende tilbehør.',                             'ADDON', NULL, 149.00, 'breastfeeding'),
(8, 'Aktivpakken',    'For aktive familier. Joggevogn, bæremeis og allværsdress.',                                     'ADDON', NULL, 249.00, 'active');

-- Package-product links
-- Nyfødtpakken: babynest, stellematte, bæresele, badestamp, ammepute
INSERT INTO package_products (package_id, product_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 10), (1, 16);

-- Spedbarnspakken: aktivitetsbue, lekematte, vognpose, bæresele
INSERT INTO package_products (package_id, product_id) VALUES
(2, 7), (2, 6), (2, 4), (2, 3);

-- Krabbepakken: sikkerhetsgitter, krabbestativ, lekematte, høystol, sengehest
INSERT INTO package_products (package_id, product_id) VALUES
(3, 8), (3, 9), (3, 6), (3, 5), (3, 12);

-- Småbarnspakken: sparkesykkel, høystol, allværsdress, sikkerhetsgitter
INSERT INTO package_products (package_id, product_id) VALUES
(4, 11), (4, 5), (4, 20), (4, 8);

-- Søvnpakken: white noise-maskin, blackout-gardin, sengehest, babynest
INSERT INTO package_products (package_id, product_id) VALUES
(5, 13), (5, 14), (5, 12), (5, 1);

-- Reisepakken: reiseseng, bæremeis, stellematte, vognpose
INSERT INTO package_products (package_id, product_id) VALUES
(6, 15), (6, 18), (6, 2), (6, 4);

-- Ammepakken: ammepute, brystpumpe, white noise-maskin
INSERT INTO package_products (package_id, product_id) VALUES
(7, 16), (7, 17), (7, 13);

-- Aktivpakken: joggevogn, bæremeis, allværsdress, sparkesykkel
INSERT INTO package_products (package_id, product_id) VALUES
(8, 19), (8, 18), (8, 20), (8, 11);

-- Test users
INSERT INTO users (id, email, password_hash, name, role) VALUES
(1, 'test@babypakka.no',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Test Bruker', 'USER'),
(2, 'admin@babypakka.no', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin Bruker', 'ADMIN');

-- Child for test user
INSERT INTO children (id, user_id, name, birth_date) VALUES
(1, 1, 'Lille Emma', '2026-01-15');

-- Subscriptions for test user's child
INSERT INTO subscriptions (id, user_id, child_id, package_id, status) VALUES
(1, 1, 1, 1, 'ACTIVE'),
(2, 1, 1, 5, 'ACTIVE');

-- Reset sequences to avoid conflicts with future inserts
SELECT setval('age_categories_id_seq', (SELECT MAX(id) FROM age_categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('packages_id_seq', (SELECT MAX(id) FROM packages));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('children_id_seq', (SELECT MAX(id) FROM children));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
