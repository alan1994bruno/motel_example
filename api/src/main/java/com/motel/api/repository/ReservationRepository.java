package com.motel.api.repository;

import com.motel.api.model.Reservation;
import com.motel.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional; // <--- Importante
import java.util.UUID;     // <--- Importante
import java.time.LocalDateTime;
import org.springframework.data.domain.Page; // Importante
import org.springframework.data.domain.Pageable; // Importante

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 1. Overbooking de Quarto (Adicionado: AND r.cancelled = false)
    // Se estiver cancelada, não conta como ocupada.
    @Query("SELECT COUNT(r) FROM Reservation r WHERE " +
            "r.room.id = :roomId AND " +
            "(r.checkinTime < :checkoutTime AND r.checkoutTime > :checkinTime) AND " +
            "r.cancelled = false")
    long countOverlappingReservations(@Param("roomId") Long roomId,
                                      @Param("checkinTime") LocalDateTime checkinTime,
                                      @Param("checkoutTime") LocalDateTime checkoutTime);

    // 2. Anti-Mutante (Adicionado: AND r.cancelled = false)
    @Query("SELECT COUNT(r) FROM Reservation r WHERE " +
            "r.user.id = :userId AND " +
            "(r.checkinTime < :checkoutTime AND r.checkoutTime > :checkinTime) AND " +
            "r.cancelled = false")
    long countUserOverlappingReservations(@Param("userId") Long userId,
                                          @Param("checkinTime") LocalDateTime checkinTime,
                                          @Param("checkoutTime") LocalDateTime checkoutTime);

    // 3. Busca de reserva ativa (Adicionado: CancelledFalse)
    Optional<Reservation> findByUserIdAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(Long userId);

    // 4. Verificação Simples (Adicionado: CancelledFalse)
    boolean existsByUserIdAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(Long userId);

    // Busca pelo Public ID (para o cancelamento)
    Optional<Reservation> findByPublicId(UUID publicId);

    // CORREÇÃO: Adicionado "AndCancelledFalse" no final
    // Busca reservas expiradas, não ocupadas, sem multa E QUE NÃO FORAM CANCELADAS
    List<Reservation> findByCheckoutTimeBeforeAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(LocalDateTime now);


    @Query("SELECT r FROM Reservation r WHERE " +
            "(r.cancelled IS NULL OR r.cancelled = false) AND " +
            "r.completed = false AND " +
            "r.checkoutTime > :now")
    Page<Reservation> findActiveReservations(@Param("now") LocalDateTime now, Pageable pageable);

    // 2. CANCELADAS (Explicitamente marcadas como true)
    @Query("SELECT r FROM Reservation r WHERE r.cancelled = true")
    Page<Reservation> findCancelledReservations(Pageable pageable);

    // 3. CONCLUÍDAS (Não canceladas E Data de saída já passou)
    @Query("SELECT r FROM Reservation r WHERE " +
            "(r.cancelled IS NULL OR r.cancelled = false) AND " +
            "r.checkoutTime <= :now")
    Page<Reservation> findCompletedReservations(@Param("now") LocalDateTime now, Pageable pageable);


    // Busca reservas de um usuário específico que tenham penalidade E não estejam completas
    List<Reservation> findByUserAndPenaltyAppliedTrueAndCompletedFalse(User user);

    // --- NOVO MÉTODO ---
    // O Spring Data entende "findBy" + Nome do Campo + "True"
    Page<Reservation> findByCompletedTrue(Pageable pageable);
}

