package no.babypakka.domain

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jpa.repository.JpaRepository

@Repository
interface ChildRepository : JpaRepository<Child, Long> {
    fun findByUserId(userId: Long): List<Child>
}
