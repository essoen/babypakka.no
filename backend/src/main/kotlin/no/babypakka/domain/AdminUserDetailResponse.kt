package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

@Serdeable
data class AdminUserDetailResponse(
    @field:Schema(description = "User ID", example = "1")
    val id: Long,

    @field:Schema(description = "Email address")
    val email: String,

    @field:Schema(description = "Full name")
    val name: String,

    @field:Schema(description = "User role")
    val role: String,

    @field:Schema(description = "Account creation date")
    val createdAt: Instant,

    @field:Schema(description = "User's children")
    val children: List<ChildResponse>,

    @field:Schema(description = "User's subscriptions")
    val subscriptions: List<SubscriptionResponse>
)
