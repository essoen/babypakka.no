package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.CreateProductRequest
import no.babypakka.domain.ProductResponse
import no.babypakka.services.ProductService

@Tag(name = "Admin - Produkter")
@Controller("/api/admin/products")
@Secured("ADMIN")
class AdminProductController(
    private val productService: ProductService
) {

    @Operation(summary = "List alle produkter (admin)")
    @ApiResponse(responseCode = "200", description = "Liste over produkter")
    @Get
    fun list(): List<ProductResponse> = productService.listAll()

    @Operation(summary = "Opprett produkt")
    @ApiResponse(responseCode = "201", description = "Produkt opprettet")
    @Post
    fun create(@Body @Valid request: CreateProductRequest): HttpResponse<ProductResponse> {
        return HttpResponse.created(productService.create(request))
    }

    @Operation(summary = "Oppdater produkt")
    @ApiResponse(responseCode = "200", description = "Produkt oppdatert")
    @ApiResponse(responseCode = "404", description = "Produkt ikke funnet")
    @Put("/{id}")
    fun update(id: Long, @Body @Valid request: CreateProductRequest): HttpResponse<ProductResponse> {
        return productService.update(id, request)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Slett produkt")
    @ApiResponse(responseCode = "204", description = "Produkt slettet")
    @ApiResponse(responseCode = "404", description = "Produkt ikke funnet")
    @Delete("/{id}")
    fun delete(id: Long): HttpResponse<Void> {
        return if (productService.delete(id)) HttpResponse.noContent() else HttpResponse.notFound()
    }
}
