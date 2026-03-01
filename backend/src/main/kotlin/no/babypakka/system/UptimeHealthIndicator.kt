package no.babypakka.system

import io.micronaut.health.HealthStatus
import io.micronaut.management.health.indicator.HealthIndicator
import io.micronaut.management.health.indicator.HealthResult
import io.micronaut.management.health.indicator.annotation.Liveness
import jakarta.inject.Singleton
import org.reactivestreams.Publisher
import java.time.Duration
import java.time.Instant
import java.util.concurrent.Flow

@Singleton
@Liveness
class UptimeHealthIndicator : HealthIndicator {

    private val startupTime: Instant = Instant.now()

    override fun getResult(): Publisher<HealthResult> {
        val uptime = Duration.between(startupTime, Instant.now())
        val result = HealthResult.builder("babypakka")
            .status(HealthStatus.UP)
            .details(
                mapOf(
                    "startupTime" to startupTime.toString(),
                    "uptime" to "${uptime.toHours()}h ${uptime.toMinutesPart()}m ${uptime.toSecondsPart()}s",
                    "version" to (javaClass.`package`.implementationVersion ?: "development"),
                    "service" to (javaClass.`package`.implementationTitle ?: "babypakka")
                )
            )
            .build()

        return Publisher { subscriber ->
            subscriber.onSubscribe(object : org.reactivestreams.Subscription {
                override fun request(n: Long) {
                    subscriber.onNext(result)
                    subscriber.onComplete()
                }
                override fun cancel() {}
            })
        }
    }
}
