package no.babypakka.system

inline fun <reified T : Enum<T>> parseEnum(value: String): T {
    return try {
        enumValueOf<T>(value.uppercase())
    } catch (e: IllegalArgumentException) {
        val valid = enumValues<T>().joinToString(", ") { it.name }
        throw IllegalArgumentException("Ugyldig verdi '${value}'. Gyldige verdier: $valid")
    }
}
