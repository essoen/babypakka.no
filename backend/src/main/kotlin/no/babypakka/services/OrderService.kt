package no.babypakka.services

import jakarta.inject.Singleton
import jakarta.transaction.Transactional
import mu.KotlinLogging
import no.babypakka.domain.*
import java.time.Instant
import java.util.Optional

private val logger = KotlinLogging.logger {}

@Singleton
open class OrderService(
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository
) {

    @Transactional
    open fun createFromSubscription(subscription: Subscription): Order {
        logger.info { "Creating order from subscription id=${subscription.id}" }

        val user = subscription.user!!
        val address = listOfNotNull(user.streetAddress, "${user.postalCode} ${user.city}")
            .joinToString(", ")

        val order = Order().apply {
            this.user = user
            this.child = subscription.child
            this.subscription = subscription
            this.status = OrderStatus.PENDING
            this.shippingAddress = address
        }

        val savedOrder = orderRepository.save(order)

        // Add products from the package
        val pkg = subscription.babyPackage!!
        pkg.products.size // force lazy init
        for (product in pkg.products) {
            val item = OrderItem().apply {
                this.order = savedOrder
                this.product = product
            }
            orderItemRepository.save(item)
        }

        return savedOrder
    }

    @Transactional
    open fun findByUserId(userId: Long): List<OrderResponse> {
        logger.debug { "Finding orders for userId=$userId" }
        return orderRepository.findByUserId(userId).map { order ->
            order.child!!.name
            order.subscription!!.babyPackage!!.name
            order.items.size
            order.items.forEach { it.product!!.name }
            OrderResponse.from(order)
        }
    }

    @Transactional
    open fun findAll(status: String? = null): List<AdminOrderResponse> {
        logger.debug { "Admin: listing all orders, status=$status" }
        val orders = if (status != null) {
            orderRepository.findByStatus(OrderStatus.valueOf(status.uppercase()))
        } else {
            orderRepository.findAll()
        }
        return orders.map { order ->
            order.user!!.name
            order.child!!.name
            order.subscription!!.babyPackage!!.name
            order.items.size
            order.items.forEach { it.product!!.name }
            AdminOrderResponse.from(order)
        }
    }

    @Transactional
    open fun updateStatus(id: Long, request: UpdateOrderStatusRequest): Optional<AdminOrderResponse> {
        logger.info { "Admin: updating order id=$id status=${request.status}" }
        return orderRepository.findById(id).map { order ->
            order.status = OrderStatus.valueOf(request.status.uppercase())
            if (request.trackingNumber != null) order.trackingNumber = request.trackingNumber
            if (request.note != null) order.note = request.note
            order.updatedAt = Instant.now()
            val updated = orderRepository.update(order)
            updated.user!!.name
            updated.child!!.name
            updated.subscription!!.babyPackage!!.name
            updated.items.size
            updated.items.forEach { it.product!!.name }
            AdminOrderResponse.from(updated)
        }
    }
}
