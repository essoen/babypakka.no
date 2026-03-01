package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal

@Serdeable
data class PackageResponse(
    @field:Schema(description = "Unique identifier", example = "1")
    val id: Long,

    @field:Schema(description = "Package name", example = "Nyfødtpakken")
    val name: String,

    @field:Schema(description = "Package description")
    val description: String?,

    @field:Schema(description = "Package type: base or addon", example = "base")
    val type: String,

    @field:Schema(description = "Associated age category, null for addon packages")
    val ageCategory: AgeCategoryResponse?,

    @field:Schema(description = "Monthly price in NOK", example = "399.00")
    val monthlyPrice: BigDecimal,

    @field:Schema(description = "Challenge tag for addon packages", example = "sleep")
    val challengeTag: String?,

    @field:Schema(description = "Products included in this package")
    val products: List<ProductResponse>
) {
    companion object {
        fun from(pkg: BabyPackage) = PackageResponse(
            id = pkg.id!!,
            name = pkg.name,
            description = pkg.description,
            type = pkg.type.name.lowercase(),
            ageCategory = pkg.ageCategory?.let { AgeCategoryResponse.from(it) },
            monthlyPrice = pkg.monthlyPrice,
            challengeTag = pkg.challengeTag,
            products = pkg.products.map { ProductResponse.from(it) }
        )
    }
}
