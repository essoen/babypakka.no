package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Serdeable
data class UpdateAddressRequest(
    @field:NotBlank
    @field:Schema(description = "Street address", example = "Storgata 1")
    val streetAddress: String,
    @field:NotBlank
    @field:Schema(description = "Postal code", example = "0182")
    val postalCode: String,
    @field:NotBlank
    @field:Schema(description = "City", example = "Oslo")
    val city: String
)
