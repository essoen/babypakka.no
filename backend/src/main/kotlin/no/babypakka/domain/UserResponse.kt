package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class UserResponse(
    @field:Schema(description = "User ID", example = "1")
    val id: Long,
    @field:Schema(description = "Email address", example = "ola@example.com")
    val email: String,
    @field:Schema(description = "Full name", example = "Ola Nordmann")
    val name: String,
    @field:Schema(description = "User role", example = "USER")
    val role: String,
    @field:Schema(description = "Street address")
    val streetAddress: String?,
    @field:Schema(description = "Postal code")
    val postalCode: String?,
    @field:Schema(description = "City")
    val city: String?
) {
    companion object {
        fun from(user: User) = UserResponse(
            id = user.id!!,
            email = user.email,
            name = user.name,
            role = user.role.name,
            streetAddress = user.streetAddress,
            postalCode = user.postalCode,
            city = user.city
        )
    }
}
