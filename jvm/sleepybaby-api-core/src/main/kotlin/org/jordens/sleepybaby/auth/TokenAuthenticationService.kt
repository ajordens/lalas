package org.jordens.sleepybaby.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.slf4j.LoggerFactory
import java.util.*

class TokenAuthenticationService(val secret: String, val expiration: Int) {
  companion object {
    val TOKEN_PREFIX = "Bearer"
    val HEADER_STRING = "Authorization"
  }

  val log = LoggerFactory.getLogger(this.javaClass)

  fun generateToken(username: String): String {
    return Jwts.builder()
      .setSubject(username)
      .setExpiration(Date(System.currentTimeMillis() + expiration))
      .signWith(SignatureAlgorithm.HS512, secret)
      .compact()
  }

  fun getUser(token: String): String? {
    try {
      val body = Jwts.parser()
        .setSigningKey(secret)
        .parseClaimsJws(token)
        .body

      val user = body.subject
      val expiration = body.expiration

      return if (user == null || (expiration != null && expiration.before(Date())))
        null
      else
        user
    } catch (e: Exception) {
      log.warn("JWT authentication failed, reason: ${e.message}")
    }

    return null
  }
}
