package com.motel.api.service;

import com.motel.api.dto.PasswordRecoveryDTO;
import com.motel.api.dto.PasswordResetDTO;
import com.motel.api.model.ForgotPasswordToken;
import com.motel.api.model.User;
import com.motel.api.repository.ForgotPasswordRepository;
import com.motel.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class PasswordService {

    private final UserRepository userRepository;
    private final ForgotPasswordRepository forgotPasswordRepository;
    private final EmailService emailService; // Seu serviço de envio de email
    private final PasswordEncoder passwordEncoder;

    public PasswordService(UserRepository userRepository,
                           ForgotPasswordRepository forgotPasswordRepository,
                           EmailService emailService,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.forgotPasswordRepository = forgotPasswordRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Gera ou Atualiza o Token
    @Transactional
    public void requestPasswordRecovery(PasswordRecoveryDTO data) {
        User user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new RuntimeException("Email não encontrado."));

        // Gera código numérico de 6 dígitos
        String code = String.format("%06d", new Random().nextInt(999999));

        // Verifica se já existe um token para este usuário
        ForgotPasswordToken token = forgotPasswordRepository.findByUser(user)
                .orElse(new ForgotPasswordToken(code, user));

        // Se já existia, atualiza o código e a validade. Se é novo, já nasceu com eles.
        token.updateToken(code);

        forgotPasswordRepository.save(token);

        // Envia o email
        emailService.sendRecoveryEmail(user.getEmail(), code);
    }

    // 2. Valida e Troca a Senha
    @Transactional
    public void resetPassword(PasswordResetDTO data) {
        ForgotPasswordToken token = forgotPasswordRepository.findByCode(data.code())
                .orElseThrow(() -> new IllegalArgumentException("Código inválido."));

        if (token.isExpired()) {
            throw new IllegalArgumentException("Código expirado. Solicite um novo.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(data.newPassword()));
        userRepository.save(user);

        // Remove o token após o uso (para não ser usado de novo)
        forgotPasswordRepository.delete(token);
    }
}