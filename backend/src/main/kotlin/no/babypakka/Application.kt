package no.babypakka

import io.micronaut.runtime.Micronaut
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info

@OpenAPIDefinition(
    info = Info(
        title = "Babypakka API",
        version = "1.0",
        description = "API for Babypakka — abonnementstjeneste for babyutstyr"
    )
)
object Application {

    @JvmStatic
    fun main(args: Array<String>) {
        Micronaut.build()
            .packages("no.babypakka")
            .mainClass(Application.javaClass)
            .eagerInitSingletons(true)
            .banner(false)
            .start()
    }
}
