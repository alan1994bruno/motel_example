package com.motel.api.service;

import com.motel.api.dto.ReservationDTO;
import com.motel.api.model.*;
import com.motel.api.repository.PenaltyRepository; // <--- Importante
import com.motel.api.repository.ReservationRepository;
import com.motel.api.repository.RoomRepository;
import com.motel.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page; // Importante
import org.springframework.data.domain.Pageable; // Importante
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PenaltyRepository penaltyRepository; // <--- 1. Nova Injeção

    // 2. Atualize o Construtor para receber o PenaltyRepository
    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              RoomRepository roomRepository,
                              PenaltyRepository penaltyRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.penaltyRepository = penaltyRepository;
    }

    @Transactional
    public Reservation createReservation(ReservationDTO data, String userEmail) {
        // 1. Buscar Usuário
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 2. Validação de Role (Apenas CLIENT)
        if (user.getRole().getLevel() != Role.Level.CLIENT) {
            throw new IllegalArgumentException("Apenas usuários CLIENT podem fazer reservas.");
        }

        // 3. Validação de Caloteiro (Penalty)
        if (penaltyRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException("Você possui multas pendentes. Regularize sua situação.");
        }

        // --- NOVA REGRA 1: UMA RESERVA POR VEZ ---
        // Se ele tem uma reserva que não ocupou e não foi multada, ele não pode criar outra.
        if (reservationRepository.existsByUserIdAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(user.getId())) {
            throw new IllegalArgumentException("Você já possui uma reserva ativa. Utilize-a antes de fazer uma nova.");
        }

        // --- NOVA REGRA 2 e 3: JANELA DE TEMPO (3 a 30 DIAS) ---
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime minDate = now.plusDays(3);  // Daqui a 3 dias
        LocalDateTime maxDate = now.plusDays(30); // Daqui a 30 dias

        // Regra: Não pode ser antes de 3 dias
        if (data.checkinTime().isBefore(minDate)) {
            throw new IllegalArgumentException("Reservas devem ser feitas com no mínimo 3 dias de antecedência.");
        }

        // Regra: Não pode ser depois de 30 dias
        if (data.checkinTime().isAfter(maxDate)) {
            throw new IllegalArgumentException("Não é possível agendar com mais de 30 dias de antecedência.");
        }

        // --- NOVA REGRA: MÁXIMO DE 6 HORAS (ROTATIVIDADE) ---
        long durationInMinutes = Duration.between(data.checkinTime(), data.checkoutTime()).toMinutes();
        if (durationInMinutes > 360) { // 6 horas * 60 minutos
            throw new IllegalArgumentException("Período inválido. A permanência máxima é de 6 horas.");
        }
        // -------------------------------------------------------



        // Validação saída antes da entrada
        if (data.checkoutTime().isBefore(data.checkinTime())) {
            throw new IllegalArgumentException("A data de saída deve ser depois da entrada.");
        }

        // Buscar Quarto
        Room room = roomRepository.findAll().stream()
                .filter(r -> r.getPublicId().equals(data.roomPublicId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Quarto não encontrado"));

        // Overbooking
        long occupiedUnits = reservationRepository.countOverlappingReservations(
                room.getId(), data.checkinTime(), data.checkoutTime()
        );

        if (occupiedUnits >= room.getUnits()) {
            throw new IllegalArgumentException("Não há vagas disponíveis para este quarto neste horário.");
        }

        // Cálculo do Preço e Save...
        Duration duration = Duration.between(data.checkinTime(), data.checkoutTime());
        long hours = duration.toHours();
        long minutesPart = duration.toMinutes() % 60;
        if (minutesPart > 0) hours++;
        if (hours == 0) hours = 1;

        BigDecimal totalPrice = room.getHourlyRate().multiply(new BigDecimal(hours));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(room);
        reservation.setCheckinTime(data.checkinTime());
        reservation.setCheckoutTime(data.checkoutTime());
        reservation.setPrice(totalPrice);

        return reservationRepository.save(reservation);
    }


    public Reservation getMyActiveReservation(String userEmail) {
        // 1. Achar o usuário pelo token
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 2. Buscar a reserva que está "travando" a agenda dele (Não ocupada e sem multa)
        return reservationRepository.findByUserIdAndOccupiedFalseAndPenaltyAppliedFalseAndCancelledFalse(user.getId())
                .orElseThrow(() -> new RuntimeException("Você não possui nenhuma reserva ativa no momento."));
    }

    // ... (Mantenha o método confirmCheckin aqui embaixo) ...
    @Transactional
    public void confirmCheckin(UUID reservationPublicId) {
        Reservation reservation = reservationRepository.findByPublicId(reservationPublicId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada."));
        reservation.setOccupied(true);
        reservationRepository.save(reservation);
    }


    @Transactional
    public void cancelReservation(UUID reservationPublicId, String userEmail) {
        // 1. Buscar a Reserva
        Reservation reservation = reservationRepository.findByPublicId(reservationPublicId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada."));

        // 2. Segurança: O usuário só pode cancelar a PRÓPRIA reserva (ou Admin)
        // Aqui assumimos que é o cliente. Se quiser admin, precisaria validar a role.
        if (!reservation.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Você não tem permissão para cancelar esta reserva.");
        }

        // 3. Validações de Status
        if (reservation.getOccupied()) {
            throw new IllegalArgumentException("Não é possível cancelar uma reserva já em andamento (Check-in realizado).");
        }
        if (reservation.getCancelled()) {
            throw new IllegalArgumentException("Esta reserva já foi cancelada.");
        }
        if (reservation.getPenaltyApplied()) {
            throw new IllegalArgumentException("Não é possível cancelar uma reserva que já gerou multa por No-Show.");
        }

        // 4. Lógica de Tempo e Penalidade
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime checkinDate = reservation.getCheckinTime();

        // Calcula horas até o check-in
        long hoursUntilCheckin = java.time.Duration.between(now, checkinDate).toHours();

        // REGRA: Menos de 48 horas (2 dias) gera multa
        if (hoursUntilCheckin < 48) {
            System.out.println(">>> Cancelamento tardio (" + hoursUntilCheckin + "h antes). Aplicando multa.");
            applyCancellationPenalty(reservation);
        }

        // 5. Efetiva o Cancelamento (Soft Delete)
        reservation.setCancelled(true);
        reservation.setCancelledAt(now);

        reservationRepository.save(reservation);
    }

    // Método auxiliar para gerar a multa
    private void applyCancellationPenalty(Reservation reservation) {
        // REGRA CORRIGIDA: Preço da Reserva + 50% do valor
        // Ex: Se a reserva era R$ 100,00 -> Multa será R$ 150,00
        BigDecimal originalPrice = reservation.getPrice();
        BigDecimal halfPrice = originalPrice.multiply(new BigDecimal("0.5"));

        BigDecimal penaltyAmount = originalPrice.add(halfPrice);

        // Cria ou Atualiza a Penalidade (Acumulativa)
        Penalty penalty = penaltyRepository.findByUserId(reservation.getUser().getId())
                .orElseGet(() -> {
                    Penalty newP = new Penalty();
                    newP.setUser(reservation.getUser());
                    newP.setPrice(BigDecimal.ZERO);
                    return newP;
                });

        penalty.setPrice(penalty.getPrice().add(penaltyAmount));
        penaltyRepository.save(penalty);
    }


    // Listar ATIVAS (Futuro)
    public Page<Reservation> findActiveReservations(int pageNumber) {
        Pageable pageable = createPageable(pageNumber);
        return reservationRepository.findActiveReservations(LocalDateTime.now(), pageable);
    }

    // Listar CANCELADAS
    public Page<Reservation> findCancelledReservations(int pageNumber) {
        Pageable pageable = createPageable(pageNumber);
        return reservationRepository.findCancelledReservations(pageable);
    }



    // Método auxiliar para não repetir código de paginação
    private Pageable createPageable(int pageNumber) {
        if (pageNumber < 1) pageNumber = 1;
        // Ordena por checkin_time decrescente (as mais novas primeiro)
        return PageRequest.of(pageNumber - 1, 10, Sort.by("checkinTime").descending());
    }


    @Transactional
    public void markAsCompleted(UUID publicId) {
        Reservation reservation = reservationRepository.findByPublicId(publicId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada."));

        if (reservation.getCompleted()) {
            throw new IllegalArgumentException("Esta reserva já foi completada anteriormente.");
        }

        reservation.setCompleted(true);
        reservationRepository.save(reservation);
    }

    // CASO 2: Sistema baixa todas as reservas penalizadas quando o usuário paga
    @Transactional
    public void resolvePenaltiesForUser(User user) {
        // 1. Busca todas as reservas desse usuário que geraram multa e estão em aberto
        List<Reservation> penalizedReservations =
                reservationRepository.findByUserAndPenaltyAppliedTrueAndCompletedFalse(user);

        // 2. Marca todas como completed
        for (Reservation res : penalizedReservations) {
            res.setCompleted(true);
        }

        // 3. Salva todas de uma vez
        reservationRepository.saveAll(penalizedReservations);
    }

    public Page<Reservation> findCompletedReservations(int page) {
        // Ajuste o tamanho da página (ex: 10 itens) e ordenação (ex: mais recentes primeiro)
        // Lembre-se: page - 1 porque o usuário envia 1, mas o Spring conta do 0
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("checkinTime").descending());

        return reservationRepository.findByCompletedTrue(pageable);
    }


}