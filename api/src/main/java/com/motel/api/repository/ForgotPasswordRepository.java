package com.motel.api.repository;

import com.motel.api.model.ForgotPasswordToken;
import com.motel.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordToken, Long> {
    Optional<ForgotPasswordToken> findByCode(String code);
    Optional<ForgotPasswordToken> findByUser(User user);
}