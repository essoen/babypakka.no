package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.QueryValue
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import no.babypakka.domain.PackageListResponse
import no.babypakka.domain.PackageResponse
import no.babypakka.domain.PackageType
import no.babypakka.services.PackageService
import no.babypakka.system.parseEnum

@Tag(name = "Pakker")
@Controller("/api/packages")
@Secured(SecurityRule.IS_ANONYMOUS)
class PackageController(
    private val packageService: PackageService
) {

    @Operation(summary = "List alle pakker", description = "Returnerer alle pakker, valgfritt filtrert på type (base/addon) eller alderskategori.")
    @ApiResponse(responseCode = "200", description = "Liste over pakker")
    @Get
    fun list(
        @QueryValue(defaultValue = "") type: String?,
        @QueryValue(defaultValue = "") ageCategoryId: Long?
    ): List<PackageListResponse> {
        return when {
            !type.isNullOrBlank() -> {
                val packageType = parseEnum<PackageType>(type)
                packageService.listByType(packageType)
            }
            ageCategoryId != null -> packageService.listByAgeCategoryId(ageCategoryId)
            else -> packageService.listAll()
        }
    }

    @Operation(summary = "Hent pakke med ID", description = "Returnerer en enkelt pakke med produkter inkludert.")
    @ApiResponse(responseCode = "200", description = "Pakke funnet")
    @ApiResponse(responseCode = "404", description = "Pakke ikke funnet")
    @Get("/{id}")
    fun getById(id: Long): HttpResponse<PackageResponse> {
        return packageService.getById(id)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
