package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import no.babypakka.system.BcryptPasswordEncoder
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: BcryptPasswordEncoder,
    private val childRepository: ChildRepository,
    private val subscriptionRepository: SubscriptionRepository,
    private val ageCategoryRepository: AgeCategoryRepository
) {

    fun register(request: RegisterRequest): User {
        logger.info { "Registering new user with email=${request.email}" }

        if (userRepository.findByEmail(request.email).isPresent) {
            throw IllegalArgumentException("En bruker med denne e-postadressen finnes allerede")
        }

        val user = User().apply {
            email = request.email
            passwordHash = passwordEncoder.encode(request.password)
            name = request.name
            role = UserRole.USER
        }

        return userRepository.save(user)
    }

    fun findByEmail(email: String): Optional<User> {
        return userRepository.findByEmail(email)
    }

    fun findById(id: Long): Optional<User> {
        return userRepository.findById(id)
    }

    fun findAll(): List<AdminUserResponse> {
        logger.debug { "Admin: listing all users" }
        return userRepository.findAll().map { user ->
            val childrenCount = childRepository.findByUserId(user.id!!).size
            val activeSubCount = subscriptionRepository.findByUserId(user.id!!).count { it.status == SubscriptionStatus.ACTIVE }
            AdminUserResponse(
                id = user.id!!,
                email = user.email,
                name = user.name,
                role = user.role.name,
                childrenCount = childrenCount,
                activeSubscriptionCount = activeSubCount,
                createdAt = user.createdAt
            )
        }
    }

    @Transactional
    open fun findByIdDetailed(id: Long): Optional<AdminUserDetailResponse> {
        logger.debug { "Admin: getting user detail for id=$id" }
        return userRepository.findById(id).map { user ->
            val children = childRepository.findByUserId(user.id!!)
            val childResponses = children.map { child ->
                ChildResponse.from(child, resolveAgeCategory(child.birthDate))
            }
            val subscriptions = subscriptionRepository.findByUserId(user.id!!).map { sub ->
                sub.child!!.name
                sub.babyPackage!!.name
                SubscriptionResponse.from(sub)
            }
            AdminUserDetailResponse(
                id = user.id!!,
                email = user.email,
                name = user.name,
                role = user.role.name,
                createdAt = user.createdAt,
                children = childResponses,
                subscriptions = subscriptions
            )
        }
    }

    fun updateAddress(userId: Long, request: UpdateAddressRequest): Optional<UserResponse> {
        logger.info { "Updating address for userId=$userId" }
        return userRepository.findById(userId).map { user ->
            user.streetAddress = request.streetAddress
            user.postalCode = request.postalCode
            user.city = request.city
            UserResponse.from(userRepository.update(user))
        }
    }

    fun updateRole(id: Long, role: String): Optional<UserResponse> {
        logger.info { "Admin: updating role for userId=$id to $role" }
        return userRepository.findById(id).map { user ->
            user.role = UserRole.valueOf(role.uppercase())
            UserResponse.from(userRepository.update(user))
        }
    }

    private fun resolveAgeCategory(birthDate: LocalDate): AgeCategory? {
        val ageInMonths = ChronoUnit.MONTHS.between(birthDate, LocalDate.now()).toInt()
        return ageCategoryRepository.findAll().firstOrNull { cat ->
            ageInMonths >= cat.minMonths && ageInMonths < cat.maxMonths
        }
    }
}
