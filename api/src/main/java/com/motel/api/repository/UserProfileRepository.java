package com.motel.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.motel.api.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    // Verifica se existe algum CPF igual
    boolean existsByCpf(String cpf);

    // Verifica se existe CPF igual, MAS que não seja do usuário dono do ID tal (Para Edição)
    boolean existsByCpfAndUserIdNot(String cpf, Long userId);
}