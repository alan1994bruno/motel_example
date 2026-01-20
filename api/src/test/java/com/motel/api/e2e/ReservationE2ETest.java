package com.motel.api.e2e;

import com.motel.api.dto.LoginDTO;
import com.motel.api.dto.ReservationDTO;
import com.motel.api.model.Reservation;
import com.motel.api.model.Role;
import com.motel.api.model.Room;
import com.motel.api.model.User;
import com.motel.api.repository.ReservationRepository;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.RoomRepository;
import com.motel.api.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ReservationE2ETest {

    @LocalServerPort
    private Integer port;

    @Autowired private UserRepository userRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private Room savedRoom;
    private String clientToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        // Ordem de limpeza importa por causa das chaves estrangeiras

        // --- CORREÇÃO DO ERRO DE DATA ---
        // Cria um Mapper que entende LocalDateTime
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        // Garante que a data vá como String "2026-01-17..." e não como array [2026, 1, 17...]
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Ensina o RestAssured a usar esse Mapper configurado
        RestAssured.config = RestAssuredConfig.config().objectMapperConfig(
                ObjectMapperConfig.objectMapperConfig().jackson2ObjectMapperFactory(
                        (type, s) -> mapper
                )
        );

        reservationRepository.deleteAll();
        userRepository.deleteAll();
        roomRepository.deleteAll();
        roleRepository.deleteAll();

        // 1. Criar um Quarto
        Room room = new Room();
        room.setName("Suíte Presidencial");
        room.setHourlyRate(new BigDecimal("200.00"));
        room.setUnits(5);
        // Se sua classe Room tiver status, configure aqui. Se não tiver, ignore.
        // room.setStatus(Room.Status.AVAILABLE);
        savedRoom = roomRepository.save(room);

        // 2. Criar Role e Cliente
        Role clientRole = new Role();
        clientRole.setLevel(Role.Level.CLIENT);
        roleRepository.save(clientRole);

        // 3. Criar Role e Admin
        Role clientRoleAdmin = new Role();
        clientRoleAdmin.setLevel(Role.Level.ADMIN);
        roleRepository.save(clientRoleAdmin);


        User client = new User();
        client.setEmail("cliente@motel.com");
        client.setPassword(passwordEncoder.encode("123456"));
        client.setRole(clientRole);
        userRepository.save(client);

        User clientAdmin = new User();
        clientAdmin.setEmail("admin@admin.com");
        clientAdmin.setPassword(passwordEncoder.encode("123456"));
        clientAdmin.setRole(clientRoleAdmin);
        userRepository.save(clientAdmin);

        // 3. Logar e guardar o token
        clientToken = loginAndGetToken("cliente@motel.com", "123456");
        adminToken = loginAndGetToken("admin@admin.com", "123456");
    }

    @Test
    @DisplayName("Deve criar uma reserva com sucesso (POST /reservations)")
    void shouldCreateReservation() {
        // ARRANGE
        // Ajuste aqui se o seu ReservationDTO usar nomes diferentes, mas a lógica é essa
        ReservationDTO dto = new ReservationDTO(
                savedRoom.getPublicId(),
                // REGRA: Mínimo 3 dias.
                // TRUQUE: Somamos 3 dias + 1 hora para compensar o tempo de execução do teste
                LocalDateTime.now().plusDays(3).plusHours(1),
                // Saída depois da entrada
                LocalDateTime.now().plusDays(3).plusHours(7)
        );

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + clientToken)
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/reservations")
                .then()
                .log().all() // <--- ADICIONE ISSO AQUI
                .statusCode(200)
                .body(containsString("Reserva criada"));
    }

    @Test
    @DisplayName("Deve buscar minha reserva ativa (GET /reservations/my-reservation)")
    void shouldGetMyReservation() {
        // ARRANGE - Criar reserva manualmente no banco
        User client = userRepository.findByEmail("cliente@motel.com").orElseThrow();

        Reservation reservation = new Reservation();
        reservation.setUser(client);
        reservation.setRoom(savedRoom);
        // CORREÇÃO: Usando os campos da sua entidade
        reservation.setCheckinTime(LocalDateTime.now().plusHours(1));
        reservation.setCheckoutTime(LocalDateTime.now().plusHours(5));
        reservation.setPrice(new BigDecimal("200.00"));

        // Estado padrão da sua entidade (Não cancelada, não ocupada = Ativa/Agendada)
        reservation.setCancelled(false);
        reservation.setOccupied(false);

        reservationRepository.save(reservation);

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + clientToken)
                .when()
                .get("/reservations/my-reservation")
                .then()
                .statusCode(200)
                .body("publicId", equalTo(reservation.getPublicId().toString()));
    }


    @Test
    @DisplayName("Deve listar apenas reservas completadas")
    void shouldListOnlyCompletedReservations() {
        // ARRANGE - Limpar banco e criar cenários
        reservationRepository.deleteAll();

        // 2. BUSCAR O USUÁRIO (Correção aqui)
        // Recuperamos o usuário que o setUp() criou pelo email
        User clientUser = userRepository.findByEmail("cliente@motel.com")
                .orElseThrow(() -> new RuntimeException("Usuário de teste não encontrado"));

        // Cria uma reserva COMPLETA (true)
        Reservation r1 = new Reservation();
        r1.setUser(clientUser); // clientUser criado no setUp
        r1.setRoom(savedRoom);
        r1.setCheckinTime(LocalDateTime.now().plusDays(1));
        r1.setCheckoutTime(LocalDateTime.now().plusDays(2));
        r1.setPrice(BigDecimal.TEN);
        r1.setCompleted(true); // <--- O QUE IMPORTA
        reservationRepository.save(r1);

        // Cria uma reserva PENDENTE (false)
        Reservation r2 = new Reservation();
        r2.setUser(clientUser);
        r2.setRoom(savedRoom);
        r2.setCheckinTime(LocalDateTime.now().plusDays(3));
        r2.setCheckoutTime(LocalDateTime.now().plusDays(4));
        r2.setPrice(BigDecimal.TEN);
        r2.setCompleted(false); // <--- NÃO DEVE VIR NA LISTA
        reservationRepository.save(r2);

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + adminToken) // Use token de Admin
                .queryParam("page", 1)
                .when()
                .get("/reservations/status/completed")
                .then()
                .statusCode(200)
                .body("content", hasSize(1)) // Só deve vir 1 (a r1)
                .body("content[0].completed", is(true));
    }

    @Test
    @DisplayName("Deve cancelar uma reserva (DELETE /reservations/{publicId})")
    void shouldCancelReservation() {
        // ARRANGE - Criar reserva
        User client = userRepository.findByEmail("cliente@motel.com").orElseThrow();

        Reservation reservation = new Reservation();
        reservation.setUser(client);
        reservation.setRoom(savedRoom);
        reservation.setCheckinTime(LocalDateTime.now().plusDays(5));
        reservation.setCheckoutTime(LocalDateTime.now().plusDays(6));
        reservation.setPrice(new BigDecimal("100.00"));
        reservation.setCancelled(false); // Começa válida

        reservationRepository.save(reservation);

        UUID publicId = reservation.getPublicId();

        // ACT & ASSERT
        given()
                .header("Authorization", "Bearer " + clientToken)
                .when()
                .delete("/reservations/" + publicId)
                .then()
                .statusCode(200)
                .body(containsString("cancelada com sucesso"));
    }

    // Método auxiliar para pegar o token
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