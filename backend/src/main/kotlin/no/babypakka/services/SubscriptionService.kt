package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import no.babypakka.system.parseEnum
import java.time.Instant
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class SubscriptionService(
    private val subscriptionRepository: SubscriptionRepository,
    private val childRepository: ChildRepository,
    private val babyPackageRepository: BabyPackageRepository,
    private val productRepository: ProductRepository,
    private val orderService: OrderService,
    private val userRepository: UserRepository
) {

    @Transactional
    open fun findByUserId(userId: Long): List<SubscriptionResponse> {
        logger.debug { "Finding subscriptions for userId=$userId" }
        return subscriptionRepository.findByUserId(userId).map { sub ->
            sub.child!!.name
            sub.babyPackage?.name
            sub.selectedProducts.size
            SubscriptionResponse.from(sub)
        }
    }

    @Transactional
    open fun findById(id: Long, userId: Long): Optional<SubscriptionResponse> {
        logger.debug { "Finding subscription id=$id for userId=$userId" }
        return subscriptionRepository.findById(id)
            .filter { it.user?.id == userId }
            .map { sub ->
                sub.child!!.name
                sub.babyPackage?.name
                sub.selectedProducts.size
                SubscriptionResponse.from(sub)
            }
    }

    @Transactional
    open fun create(userId: Long, request: CreateSubscriptionRequest): SubscriptionResponse {
        logger.info { "Creating subscription for userId=$userId, childId=${request.childId}, ageCategoryId=${request.ageCategoryId}, products=${request.productIds}" }

        // Validate user has address
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("Bruker ikke funnet") }
        if (user.streetAddress.isNullOrBlank() || user.postalCode.isNullOrBlank() || user.city.isNullOrBlank()) {
            throw IllegalArgumentException("Du må legge til en leveringsadresse før du kan opprette et abonnement")
        }

        val child = childRepository.findById(request.childId)
            .filter { it.user?.id == userId }
            .orElseThrow { IllegalArgumentException("Barnet ble ikke funnet eller tilhører ikke denne brukeren") }

        // Find the BASE package for this age category (determines pricing)
        val pkg = babyPackageRepository.findByAgeCategoryId(request.ageCategoryId)
            .firstOrNull { it.type == PackageType.BASE }
            ?: throw IllegalArgumentException("Ingen pakke funnet for denne alderskategorien")

        // Load selected products
        val products = request.productIds.mapNotNull { productId ->
            productRepository.findById(productId).orElse(null)
        }.toMutableList()

        if (products.isEmpty()) {
            throw IllegalArgumentException("Du må velge minst ett produkt")
        }

        val subscription = Subscription().apply {
            this.user = child.user
            this.child = child
            this.babyPackage = pkg
            this.status = SubscriptionStatus.ACTIVE
            this.selectedProducts = products
        }

        val saved = subscriptionRepository.save(subscription)
        // Create order for fulfillment
        orderService.createFromSubscription(saved)
        // Force lazy loading for response
        saved.child!!.name
        saved.babyPackage?.name
        saved.selectedProducts.size
        return SubscriptionResponse.from(saved)
    }

    @Transactional
    open fun cancel(id: Long, userId: Long): Optional<SubscriptionResponse> {
        logger.info { "Cancelling subscription id=$id for userId=$userId" }

        return subscriptionRepository.findById(id)
            .filter { it.user?.id == userId }
            .map { sub ->
                sub.status = SubscriptionStatus.CANCELLED
                sub.endedAt = Instant.now()
                val updated = subscriptionRepository.update(sub)
                updated.child!!.name
                updated.babyPackage?.name
                updated.selectedProducts.size
                SubscriptionResponse.from(updated)
            }
    }

    @Transactional
    open fun findAll(status: String? = null): List<SubscriptionResponse> {
        logger.debug { "Admin: listing all subscriptions, status filter=$status" }
        val subs = if (status != null) {
            subscriptionRepository.findByStatus(parseEnum<SubscriptionStatus>(status))
        } else {
            subscriptionRepository.findAll()
        }
        return subs.map { sub ->
            sub.child!!.name
            sub.babyPackage?.name
            sub.selectedProducts.size
            SubscriptionResponse.from(sub)
        }
    }

    @Transactional
    open fun updateStatus(id: Long, newStatus: String): Optional<SubscriptionResponse> {
        logger.info { "Admin: updating subscription id=$id to status=$newStatus" }
        return subscriptionRepository.findById(id).map { sub ->
            sub.status = parseEnum<SubscriptionStatus>(newStatus)
            if (sub.status == SubscriptionStatus.CANCELLED) {
                sub.endedAt = Instant.now()
            } else {
                sub.endedAt = null
            }
            val updated = subscriptionRepository.update(sub)
            updated.child!!.name
            updated.babyPackage?.name
            updated.selectedProducts.size
            SubscriptionResponse.from(updated)
        }
    }
}
