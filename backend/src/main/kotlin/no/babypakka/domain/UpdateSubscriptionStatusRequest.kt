package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Serdeable
data class UpdateSubscriptionStatusRequest(
    @field:NotBlank
    @field:Schema(description = "New status: ACTIVE, PAUSED, or CANCELLED", example = "CANCELLED")
    val status: String
)
