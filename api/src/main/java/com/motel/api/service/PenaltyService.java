package com.motel.api.service;

import com.motel.api.model.Penalty;
import com.motel.api.model.User;
import com.motel.api.repository.PenaltyRepository;
import com.motel.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final UserRepository userRepository; // Nova injeção
    private final ReservationService reservationService;

    public PenaltyService(PenaltyRepository penaltyRepository, UserRepository userRepository,ReservationService reservationService) {
        this.penaltyRepository = penaltyRepository;
        this.userRepository = userRepository;
        this.reservationService = reservationService;
    }
    // Método para o Admin ver quem está devendo
    public List<Penalty> listAll() {
        return penaltyRepository.findAll();
    }

    // O Grande Momento: Saldar a Dívida
    @Transactional
    public void payPenalty(UUID penaltyPublicId) {
        // 1. Busca a penalidade
        Penalty penalty = penaltyRepository.findByPublicId(penaltyPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Dívida não encontrada."));

        // 2. A CORREÇÃO DO ERRO:
        // Pega o usuário que é dono dessa dívida
        User user = penalty.getUser();

        // Se existir um usuário conectado, quebramos o vínculo na memória
        if (user != null) {
            user.setPenalty(null); // O usuário "solta" a penalidade
            // Isso impede que o Hibernate bloqueie o delete achando que o objeto ainda é necessário
        }

        // 3. Agora deleta sem conflito
        penaltyRepository.delete(penalty);

        reservationService.resolvePenaltiesForUser(user);
    }

    // --- NOVO MÉTODO: Consultar minha dívida ---
    public Penalty getMyPenalty(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return penaltyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Você não possui nenhuma pendência financeira."));
    }



}