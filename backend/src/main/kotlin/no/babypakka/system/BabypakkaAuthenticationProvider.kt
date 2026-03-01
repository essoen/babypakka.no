package no.babypakka.system

import io.micronaut.http.HttpRequest
import io.micronaut.security.authentication.AuthenticationFailureReason
import io.micronaut.security.authentication.AuthenticationRequest
import io.micronaut.security.authentication.AuthenticationResponse
import io.micronaut.security.authentication.provider.HttpRequestAuthenticationProvider
import jakarta.inject.Singleton
import mu.KotlinLogging
import no.babypakka.domain.UserRepository

private val logger = KotlinLogging.logger {}

@Singleton
class BabypakkaAuthenticationProvider(
    private val userRepository: UserRepository,
    private val passwordEncoder: BcryptPasswordEncoder
) : HttpRequestAuthenticationProvider<Any> {

    override fun authenticate(
        httpRequest: HttpRequest<Any>?,
        authenticationRequest: AuthenticationRequest<String, String>
    ): AuthenticationResponse {
        val email = authenticationRequest.identity
        val password = authenticationRequest.secret

        logger.debug { "Authentication attempt for email=$email" }

        val userOpt = userRepository.findByEmail(email)
        if (userOpt.isEmpty) {
            logger.warn { "Authentication failed: user not found for email=$email" }
            return AuthenticationResponse.failure(AuthenticationFailureReason.USER_NOT_FOUND)
        }

        val user = userOpt.get()
        if (!passwordEncoder.matches(password, user.passwordHash)) {
            logger.warn { "Authentication failed: invalid password for email=$email" }
            return AuthenticationResponse.failure(AuthenticationFailureReason.CREDENTIALS_DO_NOT_MATCH)
        }

        logger.info { "Authentication successful for email=$email" }
        return AuthenticationResponse.success(
            user.id.toString(),
            listOf(user.role.name),
            mapOf("email" to user.email, "name" to user.name)
        )
    }
}
