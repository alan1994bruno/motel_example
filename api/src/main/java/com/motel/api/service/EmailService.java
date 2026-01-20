package com.motel.api.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRecoveryEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("nao-responda@motel.com");
        message.setTo(toEmail);
        message.setSubject("Recuperação de Senha - Motel API");
        message.setText("Seu código de recuperação é: " + code + "\n\nEste código expira em 15 minutos.");

        mailSender.send(message);
    }
}