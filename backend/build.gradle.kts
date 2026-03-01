plugins {
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.25"
    id("org.jetbrains.kotlin.plugin.jpa") version "1.9.25"
    id("com.google.devtools.ksp") version "1.9.25-1.0.20"
    id("io.micronaut.application") version "4.6.2"
    id("com.gradleup.shadow") version "8.3.9"
    id("io.micronaut.test-resources") version "4.6.2"
}

version = "0.1"
group = "no.babypakka"

val kotlinVersion = project.properties["kotlinVersion"]

repositories {
    mavenCentral()
}

dependencies {
    // Annotation processing
    ksp("io.micronaut.data:micronaut-data-processor")
    ksp("io.micronaut:micronaut-http-validation")
    ksp("io.micronaut.openapi:micronaut-openapi")
    ksp("io.micronaut.security:micronaut-security-annotations")
    ksp("io.micronaut.serde:micronaut-serde-processor")

    // Core
    implementation("io.micronaut.kotlin:micronaut-kotlin-runtime")
    implementation("io.micronaut.serde:micronaut-serde-jackson")
    implementation("org.jetbrains.kotlin:kotlin-reflect:${kotlinVersion}")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:${kotlinVersion}")

    // Data / persistence
    implementation("io.micronaut.data:micronaut-data-hibernate-jpa")
    implementation("io.micronaut.sql:micronaut-jdbc-hikari")
    implementation("io.micronaut.flyway:micronaut-flyway")

    // Security
    implementation("io.micronaut.security:micronaut-security-jwt")
    implementation("org.mindrot:jbcrypt:0.4")

    // Logging
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
    runtimeOnly("ch.qos.logback:logback-classic")

    // Error handling (RFC 7807)
    implementation("io.micronaut.problem:micronaut-problem-json")

    // Health / management
    implementation("io.micronaut:micronaut-management")

    // OpenAPI
    compileOnly("io.micronaut.openapi:micronaut-openapi-annotations")

    // Runtime
    runtimeOnly("com.fasterxml.jackson.module:jackson-module-kotlin")
    runtimeOnly("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.yaml:snakeyaml")

    // HTTP client
    compileOnly("io.micronaut:micronaut-http-client")
    testImplementation("io.micronaut:micronaut-http-client")

    // Test
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass = "no.babypakka.Application"
}

java {
    sourceCompatibility = JavaVersion.toVersion("21")
}

graalvmNative.toolchainDetection = false

micronaut {
    runtime("netty")
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("no.babypakka.*")
    }
}

tasks.named<io.micronaut.gradle.docker.NativeImageDockerfile>("dockerfileNative") {
    jdkVersion = "21"
}
