package no.babypakka.domain

import io.micronaut.serde.annotation.Serdeable
import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate

@Serdeable
@Entity
@Table(name = "children")
class Child(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(name = "birth_date", nullable = false)
    var birthDate: LocalDate = LocalDate.now(),

    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now()
)
