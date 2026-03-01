package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Serdeable
data class CreateProductRequest(
    @field:NotBlank
    @field:Schema(description = "Product name", example = "Babynest")
    val name: String,

    @field:Schema(description = "Product description", example = "Mykt og trygt babynest")
    val description: String? = null,

    @field:Schema(description = "URL to product image", example = "https://placehold.co/400x300?text=Babynest")
    val imageUrl: String? = null,

    @field:NotBlank
    @field:Schema(description = "Product condition: NEW or USED", example = "NEW")
    val condition: String = "NEW"
)
