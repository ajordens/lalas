package org.jordens.sleepybaby.auth

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import java.io.IOException
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import org.jordens.sleepybaby.auth.TokenAuthenticationService.Companion.HEADER_STRING
import org.jordens.sleepybaby.auth.TokenAuthenticationService.Companion.TOKEN_PREFIX

class JWTAuthenticationFilter(val tokenAuthenticationService: TokenAuthenticationService) : GenericFilterBean() {
  @Throws(IOException::class, ServletException::class)
  override fun doFilter(request: ServletRequest,
                        response: ServletResponse,
                        filterChain: FilterChain) {
    val token = (request as HttpServletRequest).getHeader(HEADER_STRING)?.replace(TOKEN_PREFIX, "")

    if (token != null) {
      val user = tokenAuthenticationService.getUser(token)
      val authentication = UsernamePasswordAuthenticationToken(user, null, emptyList())

      SecurityContextHolder.getContext().authentication = authentication
    }

    filterChain.doFilter(request, response)
  }
}
