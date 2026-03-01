package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Serdeable
data class UpdateOrderStatusRequest(
    @field:NotBlank
    @field:Schema(description = "New status: PENDING, PACKING, SHIPPED, DELIVERED") val status: String,
    @field:Size(max = 200)
    @field:Schema(description = "Tracking number (optional)") val trackingNumber: String? = null,
    @field:Size(max = 200)
    @field:Schema(description = "Admin note (optional)") val note: String? = null
)
