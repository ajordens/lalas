package org.jordens.sleepybaby.auth

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
class SecurityConfig : WebSecurityConfigurerAdapter() {
  override fun configure(http: HttpSecurity) {
    val entryPoint = AuthenticationEntryPoint() { request: HttpServletRequest,
                                                  response: HttpServletResponse,
                                                  authException: AuthenticationException ->
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
    }

    http
      .authorizeRequests()
      .antMatchers("/**/*.js", "/**/*.css").permitAll()
      .antMatchers("/api/login").permitAll()
      .anyRequest().authenticated()
      .and()
      .httpBasic().authenticationEntryPoint(entryPoint)
      .and()
      .csrf().disable()
      .addFilterBefore(JWTLoginFilter("/api/login/jwt", authenticationManager()), UsernamePasswordAuthenticationFilter::class.java)
      .addFilterBefore(JWTAuthenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)
      .exceptionHandling().authenticationEntryPoint(entryPoint)
  }

  @Autowired
  fun configureGlobal(auth: AuthenticationManagerBuilder) {
    auth
      .inMemoryAuthentication()
      .withUser("user").password("password").roles("USER")
  }
}

