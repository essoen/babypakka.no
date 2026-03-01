package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDate

@Serdeable
data class CreateChildRequest(
    @field:NotBlank
    @field:Schema(description = "Child's name", example = "Lille Emma")
    val name: String,

    @field:NotNull
    @field:Schema(description = "Child's birth date", example = "2026-01-15")
    val birthDate: LocalDate
)
