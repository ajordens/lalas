package org.jordens.sleepybaby.auth

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.security.core.Authentication
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class TokenAuthenticationService {
  val EXPIRATIONTIME: Long = 60 * 60 * 1000 // 1 hour
  val SECRET = "ThisIsASecret"
  val TOKEN_PREFIX = "Bearer"
  val HEADER_STRING = "Authorization"

  fun addAuthentication(res: HttpServletResponse, username: String) {
    val JWT = Jwts.builder()
      .setSubject(username)
      .setExpiration(Date(System.currentTimeMillis() + EXPIRATIONTIME))
      .signWith(SignatureAlgorithm.HS512, SECRET)
      .compact()
    res.addHeader(HEADER_STRING, TOKEN_PREFIX + " " + JWT)
  }

  fun getAuthentication(request: HttpServletRequest): Authentication? {
    val token = request.getHeader(HEADER_STRING)
    if (token != null) {
      // parse the token.
      val body = Jwts.parser()
        .setSigningKey(SECRET)
        .parseClaimsJws(token!!.replace(TOKEN_PREFIX, ""))
        .body

      val user = body.subject
      val expiration = body.expiration

      return if (user == null || (expiration != null && expiration.before(Date())))
        null
      else
        UsernamePasswordAuthenticationToken(user, null, emptyList())
    }
    return null
  }
}
