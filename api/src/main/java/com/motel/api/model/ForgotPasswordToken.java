package com.motel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "forgot_passwords")
public class ForgotPasswordToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identificador público, caso precise manipular via API sem expor o ID sequencial
    private UUID publicId = UUID.randomUUID();

    @Column(nullable = false)
    private String code; // O código de 6 dígitos

    // UNIQUE = garante que cada usuário só tenha 1 registro nesta tabela
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    public ForgotPasswordToken(String code, User user) {
        this.code = code;
        this.user = user;
        // Validade de 15 minutos
        this.expiryDate = LocalDateTime.now().plusMinutes(15);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    // Método útil para renovar o token se o usuário pedir de novo
    public void updateToken(String newCode) {
        this.code = newCode;
        this.expiryDate = LocalDateTime.now().plusMinutes(15);
    }

    public User getUser() {
        return user;
    }
}