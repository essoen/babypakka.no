package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.CreateSubscriptionRequest
import no.babypakka.domain.SubscriptionResponse
import no.babypakka.services.SubscriptionService
import java.security.Principal

@Tag(name = "Abonnementer")
@Controller("/api/subscriptions")
@Secured(SecurityRule.IS_AUTHENTICATED)
class SubscriptionController(
    private val subscriptionService: SubscriptionService
) {

    @Operation(summary = "List abonnementer", description = "Returnerer alle abonnementer for den innloggede brukeren.")
    @ApiResponse(responseCode = "200", description = "Liste over abonnementer")
    @Get
    fun list(principal: Principal): List<SubscriptionResponse> {
        val userId = principal.name.toLong()
        return subscriptionService.findByUserId(userId)
    }

    @Operation(summary = "Hent abonnement", description = "Returnerer et abonnement med gitt ID.")
    @ApiResponse(responseCode = "200", description = "Abonnement funnet")
    @ApiResponse(responseCode = "404", description = "Abonnement ikke funnet")
    @Get("/{id}")
    fun getById(id: Long, principal: Principal): HttpResponse<SubscriptionResponse> {
        val userId = principal.name.toLong()
        return subscriptionService.findById(id, userId)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Opprett abonnement", description = "Oppretter et nytt abonnement for et barn.")
    @ApiResponse(responseCode = "201", description = "Abonnement opprettet")
    @ApiResponse(responseCode = "400", description = "Ugyldig input")
    @Post
    fun create(@Body @Valid request: CreateSubscriptionRequest, principal: Principal): HttpResponse<SubscriptionResponse> {
        val userId = principal.name.toLong()
        return try {
            val subscription = subscriptionService.create(userId, request)
            HttpResponse.created(subscription)
        } catch (e: IllegalArgumentException) {
            HttpResponse.badRequest()
        }
    }

    @Operation(summary = "Kanseller abonnement", description = "Kansellerer et aktivt abonnement.")
    @ApiResponse(responseCode = "200", description = "Abonnement kansellert")
    @ApiResponse(responseCode = "404", description = "Abonnement ikke funnet")
    @Put("/{id}/cancel")
    fun cancel(id: Long, principal: Principal): HttpResponse<SubscriptionResponse> {
        val userId = principal.name.toLong()
        return subscriptionService.cancel(id, userId)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
