package no.babypakka.domain

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jpa.repository.JpaRepository

@Repository
interface SubscriptionRepository : JpaRepository<Subscription, Long> {
    fun findByUserId(userId: Long): List<Subscription>
    fun findByChildId(childId: Long): List<Subscription>
    fun findByStatus(status: SubscriptionStatus): List<Subscription>
}
