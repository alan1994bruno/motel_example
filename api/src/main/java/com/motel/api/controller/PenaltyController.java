package com.motel.api.controller;

import com.motel.api.model.Penalty;
import com.motel.api.service.PenaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/penalties")
public class PenaltyController {

    private final PenaltyService penaltyService;

    public PenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    // GET: Admin vê a lista de caloteiros
    @GetMapping
    public ResponseEntity<List<Penalty>> listAll() {
        return penaltyService.listAll().isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(penaltyService.listAll());
    }

    // DELETE: Admin dá baixa na dívida (Saldar)
    @DeleteMapping("/{publicId}")
    public ResponseEntity<?> payPenalty(@PathVariable UUID publicId) {
        try {
            System.out.println("Bateu "+publicId);
            penaltyService.payPenalty(publicId);
            // 204 No Content é o padrão HTTP para "Deletado com sucesso"
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/my-penalty")
    public ResponseEntity<Penalty> getMyPenalty() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            Penalty penalty = penaltyService.getMyPenalty(email);
            return ResponseEntity.ok(penalty);
        } catch (RuntimeException e) {
            // Se não dever nada, retorna 404 (ou 204 No Content se preferir)
            return ResponseEntity.notFound().build();
        }
    }
}