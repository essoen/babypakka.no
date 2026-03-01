package no.babypakka.controllers

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import no.babypakka.domain.AgeCategoryResponse
import no.babypakka.services.AgeCategoryService

@Tag(name = "Alderskategorier")
@Controller("/api/age-categories")
@Secured(SecurityRule.IS_ANONYMOUS)
class AgeCategoryController(
    private val ageCategoryService: AgeCategoryService
) {

    @Operation(summary = "List alle alderskategorier")
    @ApiResponse(responseCode = "200", description = "Liste over alderskategorier")
    @Get
    fun list(): List<AgeCategoryResponse> = ageCategoryService.listAll()
}
