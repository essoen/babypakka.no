package no.babypakka.services

import jakarta.inject.Singleton
import mu.KotlinLogging
import no.babypakka.domain.AgeCategoryRepository
import no.babypakka.domain.AgeCategoryResponse
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
class AgeCategoryService(
    private val ageCategoryRepository: AgeCategoryRepository
) {

    fun listAll(): List<AgeCategoryResponse> {
        logger.debug { "Listing all age categories" }
        return ageCategoryRepository.findAll().map { AgeCategoryResponse.from(it) }
    }

    fun getById(id: Long): Optional<AgeCategoryResponse> {
        logger.debug { "Getting age category by id=$id" }
        return ageCategoryRepository.findById(id).map { AgeCategoryResponse.from(it) }
    }

    fun resolveFromMonths(months: Int): Optional<AgeCategoryResponse> {
        logger.debug { "Resolving age category for months=$months" }
        return ageCategoryRepository.findAll()
            .firstOrNull { months >= it.minMonths && months < it.maxMonths }
            ?.let { Optional.of(AgeCategoryResponse.from(it)) }
            ?: Optional.empty()
    }
}
