package no.babypakka.domain

enum class UserRole {
    USER, ADMIN
}

enum class PackageType {
    BASE, ADDON
}

enum class ProductCondition {
    NEW, USED
}

enum class SubscriptionStatus {
    ACTIVE, PAUSED, CANCELLED
}

enum class OrderStatus {
    PENDING, PACKING, SHIPPED, DELIVERED
}
