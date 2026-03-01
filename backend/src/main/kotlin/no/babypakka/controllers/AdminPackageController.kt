package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.CreatePackageRequest
import no.babypakka.domain.PackageResponse
import no.babypakka.domain.UpdatePackageProductsRequest
import no.babypakka.services.PackageService

@Tag(name = "Admin - Pakker")
@Controller("/api/admin/packages")
@Secured("ADMIN")
class AdminPackageController(
    private val packageService: PackageService
) {

    @Operation(summary = "List alle pakker med produkter (admin)")
    @ApiResponse(responseCode = "200", description = "Liste over pakker")
    @Get
    fun list(): List<PackageResponse> = packageService.listAllWithProducts()

    @Operation(summary = "Opprett pakke")
    @ApiResponse(responseCode = "201", description = "Pakke opprettet")
    @Post
    fun create(@Body @Valid request: CreatePackageRequest): HttpResponse<PackageResponse> {
        return HttpResponse.created(packageService.create(request))
    }

    @Operation(summary = "Oppdater pakke")
    @ApiResponse(responseCode = "200", description = "Pakke oppdatert")
    @ApiResponse(responseCode = "404", description = "Pakke ikke funnet")
    @Put("/{id}")
    fun update(id: Long, @Body @Valid request: CreatePackageRequest): HttpResponse<PackageResponse> {
        return packageService.update(id, request)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Slett pakke")
    @ApiResponse(responseCode = "204", description = "Pakke slettet")
    @ApiResponse(responseCode = "404", description = "Pakke ikke funnet")
    @Delete("/{id}")
    fun delete(id: Long): HttpResponse<Void> {
        return if (packageService.delete(id)) HttpResponse.noContent() else HttpResponse.notFound()
    }

    @Operation(summary = "Oppdater produkter i pakke")
    @ApiResponse(responseCode = "200", description = "Produkter oppdatert")
    @ApiResponse(responseCode = "404", description = "Pakke ikke funnet")
    @Put("/{id}/products")
    fun updateProducts(id: Long, @Body @Valid request: UpdatePackageProductsRequest): HttpResponse<PackageResponse> {
        return packageService.updateProducts(id, request.productIds)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
