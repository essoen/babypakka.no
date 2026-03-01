package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.ChildResponse
import no.babypakka.domain.CreateChildRequest
import no.babypakka.domain.UpdateChildRequest
import no.babypakka.services.ChildService
import java.security.Principal

@Tag(name = "Barn")
@Controller("/api/children")
@Secured(SecurityRule.IS_AUTHENTICATED)
class ChildController(
    private val childService: ChildService
) {

    @Operation(summary = "List barn", description = "Returnerer alle barn for den innloggede brukeren.")
    @ApiResponse(responseCode = "200", description = "Liste over barn")
    @Get
    fun list(principal: Principal): List<ChildResponse> {
        val userId = principal.name.toLong()
        return childService.findByUserId(userId)
    }

    @Operation(summary = "Hent barn", description = "Returnerer et barn med gitt ID.")
    @ApiResponse(responseCode = "200", description = "Barn funnet")
    @ApiResponse(responseCode = "404", description = "Barn ikke funnet")
    @Get("/{id}")
    fun getById(id: Long, principal: Principal): HttpResponse<ChildResponse> {
        val userId = principal.name.toLong()
        return childService.findById(id, userId)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Legg til barn", description = "Registrerer et nytt barn for den innloggede brukeren.")
    @ApiResponse(responseCode = "201", description = "Barn opprettet")
    @Post
    fun create(@Body @Valid request: CreateChildRequest, principal: Principal): HttpResponse<ChildResponse> {
        val userId = principal.name.toLong()
        val child = childService.create(userId, request)
        return HttpResponse.created(child)
    }

    @Operation(summary = "Oppdater barn", description = "Oppdaterer informasjon om et barn.")
    @ApiResponse(responseCode = "200", description = "Barn oppdatert")
    @ApiResponse(responseCode = "404", description = "Barn ikke funnet")
    @Put("/{id}")
    fun update(id: Long, @Body @Valid request: UpdateChildRequest, principal: Principal): HttpResponse<ChildResponse> {
        val userId = principal.name.toLong()
        return childService.update(id, userId, request)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Slett barn", description = "Sletter et barn.")
    @ApiResponse(responseCode = "204", description = "Barn slettet")
    @ApiResponse(responseCode = "404", description = "Barn ikke funnet")
    @Delete("/{id}")
    fun delete(id: Long, principal: Principal): HttpResponse<Void> {
        val userId = principal.name.toLong()
        return if (childService.delete(id, userId)) {
            HttpResponse.noContent()
        } else {
            HttpResponse.notFound()
        }
    }
}
