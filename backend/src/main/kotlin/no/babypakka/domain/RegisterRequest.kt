package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Serdeable
data class RegisterRequest(
    @field:NotBlank
    @field:Email
    @field:Schema(description = "Email address", example = "ola@example.com")
    val email: String,

    @field:NotBlank
    @field:Size(min = 6)
    @field:Schema(description = "Password (min 6 characters)", example = "passord123")
    val password: String,

    @field:NotBlank
    @field:Schema(description = "Full name", example = "Ola Nordmann")
    val name: String
)
