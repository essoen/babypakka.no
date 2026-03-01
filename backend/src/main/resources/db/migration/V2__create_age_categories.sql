CREATE TABLE age_categories (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    min_months INT NOT NULL,
    max_months INT NOT NULL
);
