package org.jordens.sleepybaby.auth

import org.jordens.sleepybaby.JWTConfigurationProperties
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@EnableWebSecurity(debug = false)
class SecurityConfig @Autowired constructor(val jwtConfigurationProperties: JWTConfigurationProperties) : WebSecurityConfigurerAdapter() {
  override fun configure(http: HttpSecurity) {
    val entryPoint = AuthenticationEntryPoint() { request: HttpServletRequest,
                                                  response: HttpServletResponse,
                                                  authException: AuthenticationException ->
      if (request.getHeader("content-type") == null) {
        // usually means this request came in directly from the browser (won't have JWT headers so prompt for basic)
        response.setHeader("WWW-Authenticate", "Basic realm=\"sleepybaby\"")
      }
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
    }

    val tokenAuthenticationService = TokenAuthenticationService(
      jwtConfigurationProperties.secret, jwtConfigurationProperties.expiration
    )

    http
      .authorizeRequests()
      .antMatchers("/**/*.js", "/**/*.css").permitAll()
      .antMatchers("/api/login").permitAll()
      .anyRequest().authenticated()
      .and()
      .httpBasic().authenticationEntryPoint(entryPoint)
      .and()
      .csrf().disable()
      .addFilterBefore(
        JWTLoginFilter("/api/login/jwt", authenticationManager(), tokenAuthenticationService),
        UsernamePasswordAuthenticationFilter::class.java
      )
      .addFilterBefore(
        JWTAuthenticationFilter(tokenAuthenticationService),
        UsernamePasswordAuthenticationFilter::class.java
      )
      .exceptionHandling().authenticationEntryPoint(entryPoint)
  }

  @Autowired
  fun configureGlobal(auth: AuthenticationManagerBuilder) {
    auth
      .inMemoryAuthentication()
      .withUser("user").password("password").roles("USER")
  }
}

