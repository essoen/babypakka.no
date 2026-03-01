package no.babypakka.controllers

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import no.babypakka.domain.OrderResponse
import no.babypakka.services.OrderService
import java.security.Principal

@Tag(name = "Bestillinger")
@Controller("/api/orders")
@Secured(SecurityRule.IS_AUTHENTICATED)
class OrderController(
    private val orderService: OrderService
) {

    @Operation(summary = "Hent mine bestillinger")
    @ApiResponse(responseCode = "200", description = "Liste over bestillinger")
    @Get
    fun list(principal: Principal): List<OrderResponse> {
        val userId = principal.name.toLong()
        return orderService.findByUserId(userId)
    }
}
