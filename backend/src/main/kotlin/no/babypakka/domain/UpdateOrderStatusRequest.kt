package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class UpdateOrderStatusRequest(
    @field:Schema(description = "New status: PENDING, PACKING, SHIPPED, DELIVERED") val status: String,
    @field:Schema(description = "Tracking number (optional)") val trackingNumber: String? = null,
    @field:Schema(description = "Admin note (optional)") val note: String? = null
)
