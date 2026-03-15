package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull

@Serdeable
data class CreateSubscriptionRequest(
    @field:NotNull
    @field:Schema(description = "Child ID to subscribe for", example = "1")
    val childId: Long,

    @field:NotNull
    @field:Schema(description = "Age category ID determining the price tier", example = "1")
    val ageCategoryId: Long,

    @field:NotNull
    @field:Schema(description = "List of selected product IDs", example = "[1, 2, 3]")
    val productIds: List<Long>
)
