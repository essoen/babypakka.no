package no.babypakka.controllers

import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.authentication.UsernamePasswordCredentials
import io.micronaut.security.authentication.provider.HttpRequestAuthenticationProvider
import io.micronaut.security.rules.SecurityRule
import io.micronaut.security.token.generator.TokenGenerator
import io.micronaut.security.authentication.Authentication
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import no.babypakka.domain.*
import no.babypakka.services.UserService

@Tag(name = "Autentisering")
@Controller("/api/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
class AuthController(
    private val userService: UserService,
    private val authenticationProvider: HttpRequestAuthenticationProvider<Any>,
    private val tokenGenerator: TokenGenerator
) {

    @Operation(summary = "Registrer ny bruker", description = "Oppretter en ny brukerkonto og returnerer JWT-token.")
    @ApiResponse(responseCode = "201", description = "Bruker opprettet")
    @ApiResponse(responseCode = "400", description = "Ugyldig input eller e-post er allerede i bruk")
    @Post("/register")
    fun register(@Body @Valid request: RegisterRequest): HttpResponse<AuthResponse> {
        val user = try {
            userService.register(request)
        } catch (e: IllegalArgumentException) {
            return HttpResponse.badRequest()
        }

        val authentication = Authentication.build(
            user.id.toString(),
            listOf(user.role.name),
            mapOf("email" to user.email, "name" to user.name)
        )

        val token = tokenGenerator.generateToken(authentication, 3600)
            .orElseThrow { RuntimeException("Kunne ikke generere token") }

        return HttpResponse.created(AuthResponse(
            token = token,
            user = UserResponse.from(user)
        ))
    }

    @Operation(summary = "Logg inn", description = "Autentiserer bruker og returnerer JWT-token.")
    @ApiResponse(responseCode = "200", description = "Innlogging vellykket")
    @ApiResponse(responseCode = "401", description = "Ugyldig e-post eller passord")
    @Post("/login")
    fun login(@Body @Valid request: LoginRequest): HttpResponse<AuthResponse> {
        val authRequest = UsernamePasswordCredentials(request.email, request.password)
        val authResponse = authenticationProvider.authenticate(null, authRequest)

        if (!authResponse.isAuthenticated) {
            return HttpResponse.unauthorized()
        }

        val authentication = authResponse.authentication.get()
        val token = tokenGenerator.generateToken(authentication, 3600)
            .orElseThrow { RuntimeException("Kunne ikke generere token") }

        val user = userService.findByEmail(request.email).get()

        return HttpResponse.ok(AuthResponse(
            token = token,
            user = UserResponse.from(user)
        ))
    }
}
