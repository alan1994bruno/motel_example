package com.motel.api.controller;

import com.motel.api.dto.ReservationDTO;
import com.motel.api.model.Reservation;
import com.motel.api.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import org.springframework.security.core.Authentication; // Importante
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page; // Importante


@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationDTO body, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Passamos o email do usuário logado para o service
            Reservation reservation = reservationService.createReservation(body, userDetails.getUsername());

            return ResponseEntity.ok("Reserva criada! Valor total: R$ " + reservation.getPrice());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/checkin")
    public ResponseEntity<?> checkin(@PathVariable UUID id) {
        try {
            reservationService.confirmCheckin(id);
            return ResponseEntity.ok("Check-in realizado! Quarto marcado como OCUPADO.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }


    @GetMapping("/my-reservation")
    public ResponseEntity<Reservation> getMyReservation() {
        // 1. Pega o usuário logado no contexto de segurança do Spring
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // O email vem daqui automaticamente
        try {
            Reservation reservation = reservationService.getMyActiveReservation(email);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            // Se não tiver reserva, pode retornar 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{publicId}")
    public ResponseEntity<?> cancelReservation(@PathVariable UUID publicId) {
        // Pega o usuário logado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            reservationService.cancelReservation(publicId, email);
            return ResponseEntity.ok("Reserva cancelada com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/active")
    public ResponseEntity<Page<Reservation>> listActive(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(reservationService.findActiveReservations(page));
    }

    // GET /reservations/status/cancelled
    @GetMapping("/status/cancelled")
    public ResponseEntity<Page<Reservation>> listCancelled(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(reservationService.findCancelledReservations(page));
    }


    @PutMapping("/{publicId}/complete")
    // @PreAuthorize("hasRole('ADMIN')") // Descomente se usar Security
    public ResponseEntity<?> completeReservation(@PathVariable UUID publicId) {
        try {
            reservationService.markAsCompleted(publicId);
            return ResponseEntity.ok("Reserva marcada como COMPLETADA.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/completed")
    public ResponseEntity<Page<Reservation>> listCompleted(@RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(reservationService.findCompletedReservations(page));
    }

}