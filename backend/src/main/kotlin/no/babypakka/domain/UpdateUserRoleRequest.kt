package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Serdeable
data class UpdateUserRoleRequest(
    @field:NotBlank
    @field:Schema(description = "New role: USER or ADMIN", example = "ADMIN")
    val role: String
)
