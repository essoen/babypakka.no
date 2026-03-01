package no.babypakka.controllers

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import no.babypakka.domain.AdminStatsResponse
import no.babypakka.services.AdminStatsService

@Tag(name = "Admin - Oversikt")
@Controller("/api/admin/stats")
@Secured("ADMIN")
class AdminStatsController(
    private val adminStatsService: AdminStatsService
) {

    @Operation(summary = "Hent admin-statistikk")
    @ApiResponse(responseCode = "200", description = "Statistikk hentet")
    @Get
    fun stats(): AdminStatsResponse = adminStatsService.getStats()
}
