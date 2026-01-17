package com.motel.api.e2e;

import com.motel.api.dto.LoginDTO;
import com.motel.api.dto.UserRegistrationDTO;
import com.motel.api.dto.UserUpdateDTO;
import com.motel.api.model.Role;
import com.motel.api.model.User;
import com.motel.api.model.UserProfile;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UserE2ETest {

    @LocalServerPort
    private Integer port;

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String adminToken;
    private Role clientRole;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        // Limpeza completa
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // 1. Criar Roles
        Role adminRole = new Role();
        adminRole.setLevel(Role.Level.ADMIN);
        roleRepository.save(adminRole);

        clientRole = new Role();
        clientRole.setLevel(Role.Level.CLIENT);
        roleRepository.save(clientRole);

        // 2. Criar Admin para ter poder de listar/atualizar
        User admin = new User();
        admin.setEmail("admin@motel.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRole(adminRole);
        userRepository.save(admin);

        // 3. Pegar Token de Admin
        adminToken = loginAndGetToken("admin@motel.com", "123456");
    }

    @Test
    @DisplayName("Deve registrar um novo usuário com sucesso (POST /users)")
    void shouldRegisterUser() {
        // ARRANGE
        UserRegistrationDTO dto = new UserRegistrationDTO(
                "novo@cliente.com",
                "senha123",
                "12345678900", // CPF
                "99999-000",   // CEP
                "11999999999"  // Phone
        );

        // ACT & ASSERT (Rota geralmente é pública)
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/users")
                .then()
                .log().ifError()
                .statusCode(200)
                .body(containsString("Usuário criado com ID"));
    }

    @Test
    @DisplayName("Deve listar clientes paginados (GET /users/clients)")
    void shouldListClients() {
        // ARRANGE - Criar 2 clientes no banco
        createClientInDb("c1@teste.com", "0000000001");
        createClientInDb("c2@teste.com", "0000000002");

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken) // Admin lista
                .contentType(ContentType.JSON)
                // page=0 no Spring Data é a página 1 (mas seu controller pode usar 1-based, ajuste se necessário)
                // Seu controller usa defaultValue="1", então vamos mandar param page=1
                .queryParam("page", 1)
                .when()
                .get("/users/clients")
                .then()
                .statusCode(200)
                // Verifica se no JSON de resposta (Page) tem conteúdo
                .body("content", hasSize(greaterThanOrEqualTo(2)))
                .body("content.email", hasItems("c1@teste.com", "c2@teste.com"));
    }

    @Test
    @DisplayName("Deve buscar usuário por Public ID (GET /users/{id})")
    void shouldGetByPublicId() {
        // ARRANGE
        User user = createClientInDb("buscado@teste.com", "00000003");
        UUID publicId = user.getPublicId();

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken)
                .contentType(ContentType.JSON)
                .when()
                .get("/users/" + publicId)
                .then()
                .statusCode(200)
                .body("publicId", equalTo(publicId.toString()))
                .body("email", equalTo("buscado@teste.com"));
    }

    @Test
    @DisplayName("Deve atualizar dados do usuário (PUT /users/{id})")
    void shouldUpdateUser() {
        // ARRANGE
        User user = createClientInDb("antigo@teste.com", "Antigo");
        UUID publicId = user.getPublicId();

        UserUpdateDTO updateDTO = new UserUpdateDTO(
                "novo@email.com", // mudando email
                "11888888888",    // mudando fone
                "11122233344",    // cpf
                "12345-678",      // cep
                null              // senha (opcional, null para não mudar)
        );

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken)
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/users/" + publicId)
                .then()
                .log().all() // <--- ADICIONE ISSO AQUI
                .statusCode(200)
                .body("email", equalTo("novo@email.com"))
                .body("phone", equalTo("11888888888"));
    }

    // --- Helpers ---

    private User createClientInDb(String email, String cpf) {
        User u = new User();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode("123456"));
        u.setRole(clientRole);
        UserProfile userProfile= new UserProfile();
        userProfile.setCpf(cpf);
        userProfile.setCep("44080-071");
        userProfile.setPhone("(75) 9988686053");
        u.setProfile(userProfile);
        return userRepository.save(u);
    }

    private String loginAndGetToken(String email, String password) {
        LoginDTO login = new LoginDTO(email, password);
        return given()
                .contentType(ContentType.JSON)
                .body(login)
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract().path("token");
    }
}