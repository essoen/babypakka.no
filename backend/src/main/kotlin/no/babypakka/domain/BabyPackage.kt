package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import jakarta.persistence.*
import java.math.BigDecimal

@Serdeable
@Entity
@Table(name = "packages")
class BabyPackage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    var type: PackageType = PackageType.BASE,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "age_category_id")
    var ageCategory: AgeCategory? = null,

    @Column(name = "monthly_price", nullable = false, precision = 10, scale = 2)
    var monthlyPrice: BigDecimal = BigDecimal.ZERO,

    @Column(name = "challenge_tag")
    var challengeTag: String? = null,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "package_products",
        joinColumns = [JoinColumn(name = "package_id")],
        inverseJoinColumns = [JoinColumn(name = "product_id")]
    )
    var products: MutableList<Product> = mutableListOf()
)
