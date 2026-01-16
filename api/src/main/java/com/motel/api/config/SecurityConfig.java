package com.motel.api.config;

import com.motel.api.service.AuthorizationService; // <--- Importante
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // <--- Importante
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;
    private final AuthorizationService authorizationService; // <--- Injetamos o serviço novo

    public SecurityConfig(SecurityFilter securityFilter, AuthorizationService authorizationService) {
        this.securityFilter = securityFilter;
        this.authorizationService = authorizationService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Rotas Públicas (Login e Cadastro)
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/rooms").permitAll()
                        .requestMatchers(HttpMethod.GET, "/").permitAll()

                        // 2. Rotas de ADMIN (Gestão)
                        // Criar quartos
                        .requestMatchers(HttpMethod.POST, "/rooms").hasRole("ADMIN")
                        .requestMatchers("/reservations/status/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/clients").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/penalized").hasRole("ADMIN")
                        // Dar Check-in na reserva
                        .requestMatchers(HttpMethod.PUT, "/reservations/*/checkin").hasRole("ADMIN")

                        // --- AQUI ESTÁ A REGRA DAS PENALIDADES ---
                        // O "/**" garante que pega tanto o GET (listar) quanto o DELETE com UUID
                        .requestMatchers(HttpMethod.GET, "/penalties/my-penalty").authenticated()
                        .requestMatchers("/penalties/**").hasRole("ADMIN")
                        // -----------------------------------------

                        // 3. Rotas de CLIENT (Uso)
                        // Fazer reservas
                        .requestMatchers(HttpMethod.POST, "/reservations").hasRole("CLIENT")

                        // 4. O Resto: Precisa apenas estar logado (qualquer perfil)
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // --- CORREÇÃO DO STACKOVERFLOW ---
    // Ensinamos o Spring qual serviço e qual encoder usar
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(authorizationService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}