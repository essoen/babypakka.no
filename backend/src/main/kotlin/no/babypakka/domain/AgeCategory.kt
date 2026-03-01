package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import jakarta.persistence.*

@Serdeable
@Entity
@Table(name = "age_categories")
class AgeCategory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var label: String = "",

    @Column(name = "min_months", nullable = false)
    var minMonths: Int = 0,

    @Column(name = "max_months", nullable = false)
    var maxMonths: Int = 0
)
