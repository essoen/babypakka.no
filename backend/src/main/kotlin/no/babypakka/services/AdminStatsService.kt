package no.babypakka.services

import jakarta.inject.Singleton
import mu.KotlinLogging
import no.babypakka.domain.*

private val logger = KotlinLogging.logger {}

@Singleton
open class AdminStatsService(
    private val userRepository: UserRepository,
    private val childRepository: ChildRepository,
    private val subscriptionRepository: SubscriptionRepository,
    private val productRepository: ProductRepository,
    private val babyPackageRepository: BabyPackageRepository
) {

    fun getStats(): AdminStatsResponse {
        logger.debug { "Getting admin stats" }
        val activeSubscriptions = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE).size.toLong()
        return AdminStatsResponse(
            totalUsers = userRepository.count(),
            totalChildren = childRepository.count(),
            activeSubscriptions = activeSubscriptions,
            totalProducts = productRepository.count(),
            totalPackages = babyPackageRepository.count()
        )
    }
}
