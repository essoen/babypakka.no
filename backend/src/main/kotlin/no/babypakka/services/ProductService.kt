package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import no.babypakka.system.parseEnum
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class ProductService(
    private val productRepository: ProductRepository,
    private val babyPackageRepository: BabyPackageRepository
) {

    fun listAll(): List<ProductResponse> {
        logger.debug { "Listing all products" }
        return productRepository.findAll().map { ProductResponse.from(it) }
    }

    fun getById(id: Long): Optional<ProductResponse> {
        logger.debug { "Getting product by id=$id" }
        return productRepository.findById(id).map { ProductResponse.from(it) }
    }

    @Transactional
    open fun listByAgeCategoryId(ageCategoryId: Long): List<ProductResponse> {
        logger.debug { "Listing products for ageCategoryId=$ageCategoryId" }
        val packages = babyPackageRepository.findByAgeCategoryId(ageCategoryId)
        val productIds = packages.flatMap { it.products }.map { it.id }.toSet()
        return productRepository.findAll()
            .filter { it.id in productIds }
            .map { ProductResponse.from(it) }
    }

    fun create(request: CreateProductRequest): ProductResponse {
        logger.info { "Creating product: ${request.name}" }
        val product = Product().apply {
            name = request.name
            description = request.description
            imageUrl = request.imageUrl
            condition = parseEnum<ProductCondition>(request.condition)
        }
        return ProductResponse.from(productRepository.save(product))
    }

    fun update(id: Long, request: CreateProductRequest): Optional<ProductResponse> {
        logger.info { "Updating product id=$id" }
        return productRepository.findById(id).map { product ->
            product.name = request.name
            product.description = request.description
            product.imageUrl = request.imageUrl
            product.condition = ProductCondition.valueOf(request.condition.uppercase())
            ProductResponse.from(productRepository.update(product))
        }
    }

    fun delete(id: Long): Boolean {
        logger.info { "Deleting product id=$id" }
        val product = productRepository.findById(id).orElse(null) ?: return false
        productRepository.delete(product)
        return true
    }
}
