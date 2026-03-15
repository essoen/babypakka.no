-- Direct product-to-age-category relationship for custom package building
CREATE TABLE product_age_categories (
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    age_category_id BIGINT NOT NULL REFERENCES age_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, age_category_id)
);

-- Seed: map products to age categories based on existing package_products relationships
-- Nyfødt (0-3): babynest(1), stellematte(2), bæresele(3), badestamp(10), ammepute(16)
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(1, 1), (2, 1), (3, 1), (10, 1), (16, 1);

-- Spedbarn (3-6): aktivitetsbue(7), lekematte(6), vognpose(4), bæresele(3)
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(7, 2), (6, 2), (4, 2), (3, 2);

-- Krabber (6-12): sikkerhetsgitter(8), krabbestativ(9), lekematte(6), høystol(5), sengehest(12)
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(8, 3), (9, 3), (6, 3), (5, 3), (12, 3);

-- Småbarn (1-2 år): sparkesykkel(11), høystol(5), allværsdress(20), sikkerhetsgitter(8)
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(11, 4), (5, 4), (20, 4), (8, 4);

-- Also add some cross-category products that make sense
-- White noise(13), blackout-gardin(14) - useful for all ages
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(13, 1), (13, 2), (13, 3), (13, 4),
(14, 1), (14, 2), (14, 3), (14, 4);

-- Reiseseng(15) - all ages
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(15, 1), (15, 2), (15, 3), (15, 4);

-- Brystpumpe(17) - nyfødt and spedbarn
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(17, 1), (17, 2);

-- Bæremeis(18) - spedbarn, krabber, småbarn
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(18, 2), (18, 3), (18, 4);

-- Joggevogn(19) - krabber, småbarn
INSERT INTO product_age_categories (product_id, age_category_id) VALUES
(19, 3), (19, 4);
