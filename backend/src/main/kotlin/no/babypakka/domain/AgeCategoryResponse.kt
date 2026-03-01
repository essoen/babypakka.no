package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class AgeCategoryResponse(
    @field:Schema(description = "Unique identifier", example = "1")
    val id: Long,

    @field:Schema(description = "Age category label", example = "Nyfødt (0-3 mnd)")
    val label: String,

    @field:Schema(description = "Minimum age in months", example = "0")
    val minMonths: Int,

    @field:Schema(description = "Maximum age in months", example = "3")
    val maxMonths: Int
) {
    companion object {
        fun from(category: AgeCategory) = AgeCategoryResponse(
            id = category.id!!,
            label = category.label,
            minMonths = category.minMonths,
            maxMonths = category.maxMonths
        )
    }
}
