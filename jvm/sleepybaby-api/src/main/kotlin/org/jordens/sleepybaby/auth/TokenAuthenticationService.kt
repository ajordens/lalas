package org.jordens.sleepybaby.auth

import io.jsonwebtoken.ExpiredJwtException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.jordens.sleepybaby.JWTConfigurationProperties
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class TokenAuthenticationService(val jwtConfigurationProperties: JWTConfigurationProperties) {
  val log = LoggerFactory.getLogger(this.javaClass)

  val TOKEN_PREFIX = "Bearer"
  val HEADER_STRING = "Authorization"

  fun addAuthentication(res: HttpServletResponse, username: String) {
    val JWT = Jwts.builder()
      .setSubject(username)
      .setExpiration(Date(System.currentTimeMillis() + jwtConfigurationProperties.expiration))
      .signWith(SignatureAlgorithm.HS512, jwtConfigurationProperties.secret)
      .compact()
    res.addHeader(HEADER_STRING, TOKEN_PREFIX + " " + JWT)
  }

  fun getAuthentication(request: HttpServletRequest): Authentication? {
    val token = request.getHeader(HEADER_STRING)
    if (token != null) {
      // parse the token.
      try {
        val body = Jwts.parser()
          .setSigningKey(jwtConfigurationProperties.secret)
          .parseClaimsJws(token!!.replace(TOKEN_PREFIX, ""))
          .body

        val user = body.subject
        val expiration = body.expiration

        return if (user == null || (expiration != null && expiration.before(Date())))
          null
        else
          UsernamePasswordAuthenticationToken(user, null, emptyList())
      } catch (e: Exception) {
        log.warn("JWT authentication failed, reason: ${e.message}")
      }
    }
    return null
  }
}
