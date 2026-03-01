package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class ProductResponse(
    @field:Schema(description = "Unique identifier", example = "1")
    val id: Long,

    @field:Schema(description = "Product name", example = "Babynest")
    val name: String,

    @field:Schema(description = "Product description")
    val description: String?,

    @field:Schema(description = "URL to product image")
    val imageUrl: String?,

    @field:Schema(description = "Product condition", example = "new")
    val condition: String
) {
    companion object {
        fun from(product: Product) = ProductResponse(
            id = product.id!!,
            name = product.name,
            description = product.description,
            imageUrl = product.imageUrl,
            condition = product.condition.name.lowercase()
        )
    }
}
