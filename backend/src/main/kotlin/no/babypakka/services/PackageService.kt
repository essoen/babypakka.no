package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import no.babypakka.system.parseEnum
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class PackageService(
    private val babyPackageRepository: BabyPackageRepository,
    private val ageCategoryRepository: AgeCategoryRepository,
    private val productRepository: ProductRepository
) {

    fun listAll(): List<PackageListResponse> {
        logger.debug { "Listing all packages" }
        return babyPackageRepository.findAll().map { PackageListResponse.from(it) }
    }

    fun listByType(type: PackageType): List<PackageListResponse> {
        logger.debug { "Listing packages by type=$type" }
        return babyPackageRepository.findByType(type).map { PackageListResponse.from(it) }
    }

    fun listByAgeCategoryId(ageCategoryId: Long): List<PackageListResponse> {
        logger.debug { "Listing packages for ageCategoryId=$ageCategoryId" }
        return babyPackageRepository.findByAgeCategoryId(ageCategoryId).map { PackageListResponse.from(it) }
    }

    @Transactional
    open fun getById(id: Long): Optional<PackageResponse> {
        logger.debug { "Getting package by id=$id" }
        return babyPackageRepository.findById(id).map { pkg ->
            // Force initialization of lazy products collection within transaction
            pkg.products.size
            PackageResponse.from(pkg)
        }
    }

    @Transactional
    open fun create(request: CreatePackageRequest): PackageResponse {
        logger.info { "Creating package: ${request.name}" }
        val ageCategory = request.ageCategoryId?.let {
            ageCategoryRepository.findById(it).orElse(null)
        }
        val pkg = BabyPackage().apply {
            name = request.name
            description = request.description
            type = parseEnum<PackageType>(request.type)
            this.ageCategory = ageCategory
            monthlyPrice = request.monthlyPrice
            challengeTag = request.challengeTag
        }
        val saved = babyPackageRepository.save(pkg)
        return PackageResponse.from(saved)
    }

    @Transactional
    open fun update(id: Long, request: CreatePackageRequest): Optional<PackageResponse> {
        logger.info { "Updating package id=$id" }
        return babyPackageRepository.findById(id).map { pkg ->
            val ageCategory = request.ageCategoryId?.let {
                ageCategoryRepository.findById(it).orElse(null)
            }
            pkg.name = request.name
            pkg.description = request.description
            pkg.type = PackageType.valueOf(request.type.uppercase())
            pkg.ageCategory = ageCategory
            pkg.monthlyPrice = request.monthlyPrice
            pkg.challengeTag = request.challengeTag
            pkg.products.size // force init
            PackageResponse.from(babyPackageRepository.update(pkg))
        }
    }

    @Transactional
    open fun delete(id: Long): Boolean {
        logger.info { "Deleting package id=$id" }
        val pkg = babyPackageRepository.findById(id).orElse(null) ?: return false
        babyPackageRepository.delete(pkg)
        return true
    }

    @Transactional
    open fun updateProducts(id: Long, productIds: List<Long>): Optional<PackageResponse> {
        logger.info { "Updating products for package id=$id, productIds=$productIds" }
        return babyPackageRepository.findById(id).map { pkg ->
            val products = productIds.mapNotNull { productId ->
                productRepository.findById(productId).orElse(null)
            }.toMutableList()
            pkg.products = products
            pkg.products.size // force init
            PackageResponse.from(babyPackageRepository.update(pkg))
        }
    }

    @Transactional
    open fun listAllWithProducts(): List<PackageResponse> {
        logger.debug { "Listing all packages with products (admin)" }
        return babyPackageRepository.findAll().map { pkg ->
            pkg.products.size // force init
            PackageResponse.from(pkg)
        }
    }
}
