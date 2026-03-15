package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import jakarta.persistence.*
import java.time.Instant

@Serdeable
@Entity
@Table(name = "subscriptions")
class Subscription(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    var child: Child? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    var babyPackage: BabyPackage? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: SubscriptionStatus = SubscriptionStatus.ACTIVE,

    @Column(name = "started_at", nullable = false)
    var startedAt: Instant = Instant.now(),

    @Column(name = "ended_at")
    var endedAt: Instant? = null,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "subscription_products",
        joinColumns = [JoinColumn(name = "subscription_id")],
        inverseJoinColumns = [JoinColumn(name = "product_id")]
    )
    var selectedProducts: MutableList<Product> = mutableListOf()
)
