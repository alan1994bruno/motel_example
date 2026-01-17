package com.motel.api.e2e;

import com.motel.api.dto.LoginDTO;
import com.motel.api.dto.RoomDTO;
import com.motel.api.model.Role;
import com.motel.api.model.Room;
import com.motel.api.model.User;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.RoomRepository;
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

import java.math.BigDecimal;
import java.util.List; // Importante
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class RoomE2ETest {

    @LocalServerPort
    private Integer port;

    @Autowired private RoomRepository roomRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String adminToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        // Limpeza (ordem importa se tiver chaves estrangeiras)
        // Se Room tiver relação com Reservation, limpe reservationRepository.deleteAll() antes aqui
        roomRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // 1. Criar um ADMIN
        Role adminRole = new Role();
        adminRole.setLevel(Role.Level.ADMIN);
        roleRepository.save(adminRole);

        User admin = new User();
        admin.setEmail("admin@motel.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRole(adminRole);
        userRepository.save(admin);

        // 2. Logar e pegar Token
        adminToken = loginAndGetToken("admin@motel.com", "123456");
    }

    @Test
    @DisplayName("Deve criar um quarto com sucesso (POST /rooms)")
    void shouldCreateRoom() {
        // ARRANGE
        List<String> imagensObrigatorias = List.of(
                "https://motel.com/img1.jpg",
                "https://motel.com/img2.jpg",
                "https://motel.com/img3.jpg"
        );

        RoomDTO roomDTO = new RoomDTO(
                "Suíte Temática",          // name
                new BigDecimal("150.00"),  // hourlyRate
                5,                         // units
                imagensObrigatorias        // images (Lista de 3 URLs)
        );

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken)
                .contentType(ContentType.JSON)
                .body(roomDTO)
                .when()
                .post("/rooms")
                .then()
                .log().all() // Loga erro se der 400
                .statusCode(200)
                .body("name", equalTo("Suíte Temática"))
                // Verifica se o valor voltou certo (RestAssured converte números, melhor checar float)
                .body("hourlyRate", equalTo(150.00f));
    }

    @Test
    @DisplayName("Deve listar todos os quartos (GET /rooms)")
    void shouldListAllRooms() {
        // ARRANGE - Salvar quartos manualmente
        // Atenção: Use os setters da sua ENTIDADE Room aqui (que deve ter hourlyRate e não price)
        Room r1 = new Room();
        r1.setName("Quarto Simples");
        r1.setHourlyRate(new BigDecimal("80.00")); // Ajuste para o nome do campo na Entidade
        r1.setUnits(3);
        roomRepository.save(r1);

        Room r2 = new Room();
        r2.setName("Quarto Luxo");
        r2.setHourlyRate(new BigDecimal("200.00")); // Ajuste para o nome do campo na Entidade
        r2.setUnits(5);
        roomRepository.save(r2);

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken)
                .contentType(ContentType.JSON)
                .when()
                .get("/rooms")
                .then()
                .statusCode(200)
                .body("size()", is(2))
                .body("name", hasItems("Quarto Simples", "Quarto Luxo"));
    }

    // Helper de login
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