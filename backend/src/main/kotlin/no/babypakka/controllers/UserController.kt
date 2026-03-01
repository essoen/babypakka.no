package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.UpdateAddressRequest
import no.babypakka.domain.UserResponse
import no.babypakka.services.UserService
import java.security.Principal

@Tag(name = "Bruker")
@Controller("/api/users")
@Secured(SecurityRule.IS_AUTHENTICATED)
class UserController(
    private val userService: UserService
) {

    @Operation(summary = "Hent innlogget bruker")
    @ApiResponse(responseCode = "200", description = "Bruker funnet")
    @Get("/me")
    fun me(principal: Principal): HttpResponse<UserResponse> {
        val userId = principal.name.toLong()
        return userService.findById(userId)
            .map { HttpResponse.ok(UserResponse.from(it)) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Oppdater leveringsadresse")
    @ApiResponse(responseCode = "200", description = "Adresse oppdatert")
    @Put("/me/address")
    fun updateAddress(@Body @Valid request: UpdateAddressRequest, principal: Principal): HttpResponse<UserResponse> {
        val userId = principal.name.toLong()
        return userService.updateAddress(userId, request)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
