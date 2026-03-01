package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.Instant

@Serdeable
data class SubscriptionResponse(
    @field:Schema(description = "Subscription ID", example = "1")
    val id: Long,

    @field:Schema(description = "Child ID", example = "1")
    val childId: Long,

    @field:Schema(description = "Child's name", example = "Lille Emma")
    val childName: String,

    @field:Schema(description = "Package ID", example = "1")
    val packageId: Long,

    @field:Schema(description = "Package name", example = "Nyfødtpakken")
    val packageName: String,

    @field:Schema(description = "Package type", example = "base")
    val packageType: String,

    @field:Schema(description = "Monthly price in NOK", example = "399.00")
    val monthlyPrice: BigDecimal,

    @field:Schema(description = "Subscription status", example = "ACTIVE")
    val status: String,

    @field:Schema(description = "Start date")
    val startedAt: Instant,

    @field:Schema(description = "End date, null if active")
    val endedAt: Instant?
) {
    companion object {
        fun from(sub: Subscription) = SubscriptionResponse(
            id = sub.id!!,
            childId = sub.child!!.id!!,
            childName = sub.child!!.name,
            packageId = sub.babyPackage!!.id!!,
            packageName = sub.babyPackage!!.name,
            packageType = sub.babyPackage!!.type.name.lowercase(),
            monthlyPrice = sub.babyPackage!!.monthlyPrice,
            status = sub.status.name,
            startedAt = sub.startedAt,
            endedAt = sub.endedAt
        )
    }
}
