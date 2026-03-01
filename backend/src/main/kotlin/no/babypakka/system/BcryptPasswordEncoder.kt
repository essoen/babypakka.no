package no.babypakka.system

import jakarta.inject.Singleton
import org.mindrot.jbcrypt.BCrypt

@Singleton
class BcryptPasswordEncoder {
    fun encode(rawPassword: String): String = BCrypt.hashpw(rawPassword, BCrypt.gensalt())
    fun matches(rawPassword: String, encodedPassword: String): Boolean = BCrypt.checkpw(rawPassword, encodedPassword)
}
