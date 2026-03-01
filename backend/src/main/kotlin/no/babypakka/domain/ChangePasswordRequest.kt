package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Serdeable
data class ChangePasswordRequest(
    @field:NotBlank
    @field:Schema(description = "Current password")
    val currentPassword: String,
    @field:NotBlank
    @field:Size(min = 6)
    @field:Schema(description = "New password (minimum 6 characters)")
    val newPassword: String
)
