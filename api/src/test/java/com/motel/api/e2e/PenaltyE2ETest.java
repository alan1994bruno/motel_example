package com.motel.api.e2e;

import com.motel.api.dto.LoginDTO;
import com.motel.api.model.Penalty;
import com.motel.api.model.Role;
import com.motel.api.model.User;
import com.motel.api.repository.PenaltyRepository;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test") // <--- ISSO AQUI FAZ A MÁGICA (Lê o application-test.properties)
class PenaltyE2ETest { // Removemos 'extends AbstractIntegrationTest'

    @LocalServerPort
    private Integer port;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PenaltyRepository penaltyRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        // Limpeza manual garantida
        penaltyRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void adminShouldBeAbleToDeletePenalty() {
        // --- 1. ARRANGE ---
        Role adminRole = new Role();
        adminRole.setLevel(Role.Level.ADMIN);
        roleRepository.save(adminRole);

        User admin = new User();
        admin.setEmail("admin@test.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRole(adminRole);
        userRepository.save(admin);

        User client = new User();
        client.setEmail("client@test.com");
        client.setPassword(passwordEncoder.encode("123456"));
        userRepository.save(client);

        Penalty penalty = new Penalty();
        penalty.setPrice(new BigDecimal("150.00"));
        penalty.setUser(client);
        client.setPenalty(penalty);

        penaltyRepository.save(penalty);
        userRepository.save(client);

        UUID penaltyPublicId = penalty.getPublicId();

        // --- 2. ACT ---
        LoginDTO loginData = new LoginDTO("admin@test.com", "123456");

        String token = given()
                .contentType(ContentType.JSON)
                .body(loginData)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract().path("token");

        given()
                .header("Authorization", "Bearer " + token)
                .pathParam("id", penaltyPublicId)
                .when()
                .delete("/penalties/{id}")
                .then()
                .statusCode(204);

        // --- 3. ASSERT ---
        boolean penaltyExists = penaltyRepository.findByPublicId(penaltyPublicId).isPresent();
        assertThat(penaltyExists).isFalse();

        User updatedClient = userRepository.findByEmail("client@test.com").orElseThrow();
        assertThat(updatedClient.getPenalty()).isNull();
    }
}