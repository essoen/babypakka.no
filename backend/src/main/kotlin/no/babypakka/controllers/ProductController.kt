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
import no.babypakka.domain.ProductResponse
import no.babypakka.services.ProductService

@Tag(name = "Produkter")
@Controller("/api/products")
@Secured(SecurityRule.IS_ANONYMOUS)
class ProductController(
    private val productService: ProductService
) {

    @Operation(summary = "List alle produkter", description = "Returnerer alle produkter, valgfritt filtrert på alderskategori.")
    @ApiResponse(responseCode = "200", description = "Liste over produkter")
    @Get
    fun list(@QueryValue(defaultValue = "") ageCategoryId: Long?): List<ProductResponse> {
        return if (ageCategoryId != null) {
            productService.listByAgeCategoryId(ageCategoryId)
        } else {
            productService.listAll()
        }
    }

    @Operation(summary = "Hent produkt med ID", description = "Returnerer et enkelt produkt.")
    @ApiResponse(responseCode = "200", description = "Produkt funnet")
    @ApiResponse(responseCode = "404", description = "Produkt ikke funnet")
    @Get("/{id}")
    fun getById(id: Long): HttpResponse<ProductResponse> {
        return productService.getById(id)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
