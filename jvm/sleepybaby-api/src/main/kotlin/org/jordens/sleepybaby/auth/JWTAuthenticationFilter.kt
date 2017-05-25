package org.jordens.sleepybaby.auth

import org.springframework.security.core.context.SecurityContextHolder
import java.io.IOException
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest

class JWTAuthenticationFilter(val tokenAuthenticationService: TokenAuthenticationService) : GenericFilterBean() {
  @Throws(IOException::class, ServletException::class)
  override fun doFilter(request: ServletRequest,
                        response: ServletResponse,
                        filterChain: FilterChain) {
    val authentication = tokenAuthenticationService.getAuthentication(request as HttpServletRequest)

    SecurityContextHolder.getContext().authentication = authentication
    filterChain.doFilter(request, response)
  }
}
