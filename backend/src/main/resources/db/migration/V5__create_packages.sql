CREATE TABLE packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    age_category_id BIGINT REFERENCES age_categories(id),
    monthly_price DECIMAL(10,2) NOT NULL,
    challenge_tag VARCHAR(100)
);
