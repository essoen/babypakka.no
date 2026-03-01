package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import io.swagger.v3.oas.annotations.media.Schema

@Serdeable
data class UpdatePackageProductsRequest(
    @field:Schema(description = "List of product IDs to include in the package", example = "[1, 2, 3]")
    val productIds: List<Long>
)
