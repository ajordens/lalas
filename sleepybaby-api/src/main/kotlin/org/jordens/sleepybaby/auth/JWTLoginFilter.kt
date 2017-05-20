package org.jordens.sleepybaby.auth

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.jordens.sleepybaby.JWTConfigurationProperties
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter

import org.springframework.security.core.Authentication

import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.util.Collections

class JWTLoginFilter(url: String,
                     authManager: AuthenticationManager,
                     tokenAuthService: TokenAuthenticationService) : AbstractAuthenticationProcessingFilter(AntPathRequestMatcher(url)) {
  val objectMapper = ObjectMapper().registerKotlinModule()
  val tokenAuthenticationService : TokenAuthenticationService

  init {
    authenticationManager = authManager
    tokenAuthenticationService = tokenAuthService
  }

  override fun attemptAuthentication(req: HttpServletRequest,
                                     res: HttpServletResponse): Authentication {
    val accountCredentials = objectMapper.readValue(req.getInputStream(), AccountCredentials::class.java)

    return authenticationManager.authenticate(
      UsernamePasswordAuthenticationToken(
        accountCredentials.username,
        accountCredentials.password,
        Collections.emptyList()
      )
    )
  }

  override fun successfulAuthentication(req: HttpServletRequest,
                                        res: HttpServletResponse, chain: FilterChain,
                                        auth: Authentication) {
    tokenAuthenticationService.addAuthentication(res, auth.getName())
  }
}
