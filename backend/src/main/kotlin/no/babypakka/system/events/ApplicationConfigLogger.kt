package no.babypakka.system.events

import io.micronaut.context.annotation.Context
import io.micronaut.context.env.Environment
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

private val SENSITIVE_KEYS = listOf("password", "secret", "credential", "token", "key")

@Context
class ApplicationConfigLogger(environment: Environment) {

    init {
        val properties = mutableMapOf<String, String>()

        environment.propertySources.forEach { source ->
            source.forEach { key ->
                val value = source.get(key)?.toString() ?: ""
                val masked = if (SENSITIVE_KEYS.any { key.lowercase().contains(it) }) "****" else value
                properties[key] = masked
            }
        }

        logger.info { "=== Application Configuration ===" }
        properties.toSortedMap().forEach { (key, value) ->
            logger.info { "  $key = $value" }
        }
        logger.info { "=== End Configuration ===" }
    }
}
