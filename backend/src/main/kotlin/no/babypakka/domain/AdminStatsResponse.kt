package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class AdminStatsResponse(
    @field:Schema(description = "Total number of users")
    val totalUsers: Long,

    @field:Schema(description = "Total number of children")
    val totalChildren: Long,

    @field:Schema(description = "Total number of active subscriptions")
    val activeSubscriptions: Long,

    @field:Schema(description = "Total number of products")
    val totalProducts: Long,

    @field:Schema(description = "Total number of packages")
    val totalPackages: Long
)
