package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class ChildService(
    private val childRepository: ChildRepository,
    private val userRepository: UserRepository,
    private val ageCategoryRepository: AgeCategoryRepository
) {

    fun findByUserId(userId: Long): List<ChildResponse> {
        logger.debug { "Finding children for userId=$userId" }
        return childRepository.findByUserId(userId).map { child ->
            ChildResponse.from(child, resolveAgeCategory(child.birthDate))
        }
    }

    fun findById(id: Long, userId: Long): Optional<ChildResponse> {
        logger.debug { "Finding child id=$id for userId=$userId" }
        return childRepository.findById(id)
            .filter { it.user?.id == userId }
            .map { child -> ChildResponse.from(child, resolveAgeCategory(child.birthDate)) }
    }

    fun create(userId: Long, request: CreateChildRequest): ChildResponse {
        logger.info { "Creating child for userId=$userId, name=${request.name}" }

        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("Bruker ikke funnet") }

        val child = Child().apply {
            this.user = user
            name = request.name
            birthDate = request.birthDate
        }

        val saved = childRepository.save(child)
        return ChildResponse.from(saved, resolveAgeCategory(saved.birthDate))
    }

    fun update(id: Long, userId: Long, request: UpdateChildRequest): Optional<ChildResponse> {
        logger.info { "Updating child id=$id for userId=$userId" }

        return childRepository.findById(id)
            .filter { it.user?.id == userId }
            .map { child ->
                child.name = request.name
                child.birthDate = request.birthDate
                val updated = childRepository.update(child)
                ChildResponse.from(updated, resolveAgeCategory(updated.birthDate))
            }
    }

    fun delete(id: Long, userId: Long): Boolean {
        logger.info { "Deleting child id=$id for userId=$userId" }

        val child = childRepository.findById(id)
            .filter { it.user?.id == userId }
            .orElse(null) ?: return false

        childRepository.delete(child)
        return true
    }

    fun resolveAgeCategory(birthDate: LocalDate): AgeCategory? {
        val ageInMonths = ChronoUnit.MONTHS.between(birthDate, LocalDate.now()).toInt()
        return ageCategoryRepository.findAll().firstOrNull { cat ->
            ageInMonths >= cat.minMonths && ageInMonths < cat.maxMonths
        }
    }
}
