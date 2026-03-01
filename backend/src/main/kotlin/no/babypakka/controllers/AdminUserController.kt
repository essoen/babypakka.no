package no.babypakka.controllers

import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.AdminUserDetailResponse
import no.babypakka.domain.AdminUserResponse
import no.babypakka.domain.UpdateUserRoleRequest
import no.babypakka.domain.UserResponse
import no.babypakka.services.UserService

@Tag(name = "Admin - Brukere")
@Controller("/api/admin/users")
@Secured("ADMIN")
class AdminUserController(
    private val userService: UserService
) {

    @Operation(summary = "List alle brukere (admin)")
    @ApiResponse(responseCode = "200", description = "Liste over brukere")
    @Get
    fun list(): List<AdminUserResponse> = userService.findAll()

    @Operation(summary = "Hent brukerdetaljer (admin)")
    @ApiResponse(responseCode = "200", description = "Bruker funnet")
    @ApiResponse(responseCode = "404", description = "Bruker ikke funnet")
    @Get("/{id}")
    fun getById(id: Long): HttpResponse<AdminUserDetailResponse> {
        return userService.findByIdDetailed(id)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }

    @Operation(summary = "Endre brukerrolle", description = "Endrer rollen til en bruker (USER eller ADMIN).")
    @ApiResponse(responseCode = "200", description = "Rolle oppdatert")
    @ApiResponse(responseCode = "404", description = "Bruker ikke funnet")
    @Put("/{id}/role")
    fun updateRole(id: Long, @Body @Valid request: UpdateUserRoleRequest): HttpResponse<UserResponse> {
        return userService.updateRole(id, request.role)
            .map { HttpResponse.ok(it) }
            .orElse(HttpResponse.notFound())
    }
}
