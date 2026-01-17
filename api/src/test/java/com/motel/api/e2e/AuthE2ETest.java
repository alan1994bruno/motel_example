package com.motel.api.e2e;

import com.motel.api.dto.LoginDTO;
import com.motel.api.model.Role;
import com.motel.api.model.User;
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

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test") // Usa o seu banco da porta 5433
class AuthE2ETest {

    @LocalServerPort
    private Integer port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        userRepository.deleteAll(); // Limpa o banco para não dar erro de email duplicado
        roleRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve retornar Token e Email quando credenciais forem válidas")
    void shouldLoginSuccessfully() {
        Role client = new Role();
        client.setLevel(Role.Level.CLIENT);
        roleRepository.save(client);

        // --- 1. CENÁRIO (Cria um usuário real no banco) ---
        User user = new User();
        user.setEmail("teste@login.com");
        user.setRole(client);
        // IMPORTANTE: Tem que salvar a senha criptografada, senão o login falha
        user.setPassword(passwordEncoder.encode("senha123"));
        userRepository.save(user);

        // --- 2. AÇÃO (Tenta logar via API) ---
        LoginDTO loginPayload = new LoginDTO("teste@login.com", "senha123");

        given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200) // Espera Sucesso
                .body("token", notNullValue()) // Garante que veio um token
                .body("email", equalTo("teste@login.com")); // Garante que devolveu o email
    }

    @Test
    @DisplayName("Deve retornar 403/401 quando a senha estiver errada")
    void shouldFailLoginWithWrongPassword() {
        // --- 1. CENÁRIO ---
        User user = new User();
        user.setEmail("teste@errado.com");
        user.setPassword(passwordEncoder.encode("senhaCerta"));
        userRepository.save(user);

        // --- 2. AÇÃO (Manda senha errada) ---
        LoginDTO loginPayload = new LoginDTO("teste@errado.com", "senhaErrada");

        given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .when()
                .post("/auth/login")
                .then()
                // O Spring Security costuma retornar 401 ou 403 para falha de login
                // Vamos aceitar qualquer um dos dois para o teste não quebrar por detalhe
                .statusCode(org.hamcrest.Matchers.isOneOf(401, 403));
    }
}