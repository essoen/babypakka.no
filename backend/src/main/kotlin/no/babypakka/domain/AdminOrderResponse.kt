package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

@Serdeable
data class AdminOrderResponse(
    @field:Schema(description = "Order ID") val id: Long,
    @field:Schema(description = "User ID") val userId: Long,
    @field:Schema(description = "User name") val userName: String,
    @field:Schema(description = "User email") val userEmail: String,
    @field:Schema(description = "Child name") val childName: String,
    @field:Schema(description = "Package name") val packageName: String,
    @field:Schema(description = "Order status") val status: String,
    @field:Schema(description = "Tracking number") val trackingNumber: String?,
    @field:Schema(description = "Admin note") val note: String?,
    @field:Schema(description = "Shipping address") val shippingAddress: String,
    @field:Schema(description = "Products in order") val products: List<String>,
    @field:Schema(description = "Created date") val createdAt: Instant,
    @field:Schema(description = "Last updated") val updatedAt: Instant
) {
    companion object {
        fun from(order: Order) = AdminOrderResponse(
            id = order.id!!,
            userId = order.user!!.id!!,
            userName = order.user!!.name,
            userEmail = order.user!!.email,
            childName = order.child!!.name,
            packageName = order.subscription!!.babyPackage?.name ?: "Egendefinert pakke",
            status = order.status.name,
            trackingNumber = order.trackingNumber,
            note = order.note,
            shippingAddress = order.shippingAddress,
            products = order.items.map { it.product!!.name },
            createdAt = order.createdAt,
            updatedAt = order.updatedAt
        )
    }
}
