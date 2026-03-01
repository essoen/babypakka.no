package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@Serdeable
data class LoginRequest(
    @field:NotBlank
    @field:Email
    @field:Schema(description = "Email address", example = "test@babypakka.no")
    val email: String,

    @field:NotBlank
    @field:Schema(description = "Password", example = "passord123")
    val password: String
)
