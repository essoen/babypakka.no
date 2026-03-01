package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

@Serdeable
data class CreatePackageRequest(
    @field:NotBlank
    @field:Schema(description = "Package name", example = "Nyfødtpakken")
    val name: String,

    @field:Schema(description = "Package description")
    val description: String? = null,

    @field:NotBlank
    @field:Schema(description = "Package type: BASE or ADDON", example = "BASE")
    val type: String,

    @field:Schema(description = "Age category ID (for base packages)", example = "1")
    val ageCategoryId: Long? = null,

    @field:NotNull
    @field:Schema(description = "Monthly price in NOK", example = "399.00")
    val monthlyPrice: BigDecimal,

    @field:Schema(description = "Challenge tag for addon packages", example = "sleep")
    val challengeTag: String? = null
)
