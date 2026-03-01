package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.SubscriptionResponse
import no.babypakka.domain.UpdateSubscriptionStatusRequest
import no.babypakka.services.SubscriptionService

@Tag(name = "Admin - Abonnementer")
@Controller("/api/admin/subscriptions")
@Secured("ADMIN")
class AdminSubscriptionController(
    private val subscriptionService: SubscriptionService
) {

    @Operation(summary = "List alle abonnementer (admin)")
    @ApiResponse(responseCode = "200", description = "Liste over abonnementer")
    @Get
    fun list(@QueryValue(defaultValue = "") status: String?): List<SubscriptionResponse> {
        return subscriptionService.findAll(status?.takeIf { it.isNotBlank() })
    }

    @Operation(summary = "Oppdater abonnementstatus")
    @ApiResponse(responseCode = "200", description = "Status oppdatert")
    @ApiResponse(responseCode = "404", description = "Abonnement ikke funnet")
    @Put("/{id}/status")
    fun updateStatus(id: Long, @Body @Valid request: UpdateSubscriptionStatusRequest): HttpResponse<SubscriptionResponse> {
        return subscriptionService.updateStatus(id, request.status)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
