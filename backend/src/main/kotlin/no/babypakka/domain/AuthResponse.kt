package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class AuthResponse(
    @field:Schema(description = "JWT access token")
    val token: String,

    @field:Schema(description = "Authenticated user")
    val user: UserResponse
)
