package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate
import java.time.Instant

@Serdeable
data class ChildResponse(
    @field:Schema(description = "Child ID", example = "1")
    val id: Long,

    @field:Schema(description = "Child's name", example = "Lille Emma")
    val name: String,

    @field:Schema(description = "Birth date", example = "2026-01-15")
    val birthDate: LocalDate,

    @field:Schema(description = "Current age category based on birth date")
    val ageCategory: AgeCategoryResponse?,

    @field:Schema(description = "Created timestamp")
    val createdAt: Instant
) {
    companion object {
        fun from(child: Child, ageCategory: AgeCategory?) = ChildResponse(
            id = child.id!!,
            name = child.name,
            birthDate = child.birthDate,
            ageCategory = ageCategory?.let { AgeCategoryResponse.from(it) },
            createdAt = child.createdAt
        )
    }
}
