package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.AdminOrderResponse
import no.babypakka.domain.UpdateOrderStatusRequest
import no.babypakka.services.OrderService

@Tag(name = "Admin - Ordrer")
@Controller("/api/admin/orders")
@Secured("ADMIN")
class AdminOrderController(
    private val orderService: OrderService
) {

    @Operation(summary = "List alle ordrer (admin)")
    @ApiResponse(responseCode = "200", description = "Liste over ordrer")
    @Get
    fun list(@QueryValue(defaultValue = "") status: String?): List<AdminOrderResponse> {
        return orderService.findAll(status?.takeIf { it.isNotBlank() })
    }

    @Operation(summary = "Oppdater ordrestatus")
    @ApiResponse(responseCode = "200", description = "Status oppdatert")
    @ApiResponse(responseCode = "404", description = "Ordre ikke funnet")
    @Put("/{id}/status")
    fun updateStatus(id: Long, @Body @Valid request: UpdateOrderStatusRequest): HttpResponse<AdminOrderResponse> {
        return orderService.updateStatus(id, request)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
