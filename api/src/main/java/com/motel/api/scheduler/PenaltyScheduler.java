package com.motel.api.scheduler;

import com.motel.api.model.Penalty;
import com.motel.api.model.Reservation;
import com.motel.api.repository.PenaltyRepository;
import com.motel.api.repository.ReservationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PenaltyScheduler {

    private final ReservationRepository reservationRepository;
    private final PenaltyRepository penaltyRepository;

    public PenaltyScheduler(ReservationRepository reservationRepository, PenaltyRepository penaltyRepository) {
        this.reservationRepository = reservationRepository;
        this.penaltyRepository = penaltyRepository;
    }

    // Roda a cada 1 minuto (60000 milissegundos)
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void checkNoShowReservations() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expiredReservations = reservationRepository
                .findByCheckoutTimeBeforeAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(now);

        for (Reservation reservation : expiredReservations) {
            System.out.println("--- Processando multa para: " + reservation.getUser().getEmail());

            // 1. Calcula o valor dessa infração
            BigDecimal originalPrice = reservation.getPrice();
            BigDecimal fineAmount = originalPrice.add(originalPrice.multiply(new BigDecimal("0.5")));

            // 2. LÓGICA DE ACUMULO (UPSERT)
            // Busca se o usuário já tem dívida ativa
            Penalty penalty = penaltyRepository.findByUserId(reservation.getUser().getId())
                    .orElseGet(() -> {
                        // Se não tiver, cria uma zerada
                        Penalty newPenalty = new Penalty();
                        newPenalty.setUser(reservation.getUser());
                        newPenalty.setPrice(BigDecimal.ZERO);
                        return newPenalty;
                    });

            // 3. Soma o valor novo ao saldo devedor
            penalty.setPrice(penalty.getPrice().add(fineAmount));

            // 4. Salva (Se já existia, atualiza. Se é nova, insere)
            penaltyRepository.save(penalty);

            // 5. Marca a reserva como processada
            reservation.setPenaltyApplied(true);
            reservationRepository.save(reservation);
        }
    }
}