package no.babypakka.domain

import io.micronaut.data.annotation.Repository
import io.micronaut.data.jpa.repository.JpaRepository

@Repository
interface BabyPackageRepository : JpaRepository<BabyPackage, Long> {
    fun findByType(type: PackageType): List<BabyPackage>
    fun findByAgeCategoryId(ageCategoryId: Long): List<BabyPackage>
}
