-- Track individually selected products per subscription
CREATE TABLE subscription_products (
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (subscription_id, product_id)
);

-- Migrate existing subscriptions: copy products from their package
INSERT INTO subscription_products (subscription_id, product_id)
SELECT s.id, pp.product_id
FROM subscriptions s
JOIN package_products pp ON pp.package_id = s.package_id;

-- Make package_id nullable on subscriptions (custom packages don't need one)
ALTER TABLE subscriptions ALTER COLUMN package_id DROP NOT NULL;
