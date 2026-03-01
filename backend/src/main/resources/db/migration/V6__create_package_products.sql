CREATE TABLE package_products (
    package_id BIGINT NOT NULL REFERENCES packages(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    PRIMARY KEY (package_id, product_id)
);
