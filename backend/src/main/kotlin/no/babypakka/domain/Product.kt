package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import jakarta.persistence.*

@Serdeable
@Entity
@Table(name = "products")
class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(name = "image_url")
    var imageUrl: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var condition: ProductCondition = ProductCondition.NEW
)
