package no.babypakka.domain

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jpa.repository.JpaRepository

@Repository
interface AgeCategoryRepository : JpaRepository<AgeCategory, Long>
