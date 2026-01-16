package com.motel.api.seeder;
import com.motel.api.model.Role;
import com.motel.api.model.User;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Verifica se o admin já existe (Idempotência)
        // Se já existir, para o código aqui. Não queremos duplicar.
        if (userRepository.findByEmail("admin@admin.com").isPresent()) {
            System.out.println(">>> SEED: Admin já existe. Pulando criação.");
            return;
        }

        // 2. Busca a Role ADMIN (que o Flyway V1 já inseriu no banco)
        Role adminRole = roleRepository.findByLevel(Role.Level.ADMIN)
                .orElseThrow(() -> new RuntimeException("Role ADMIN não encontrada! Verifique o Flyway V1."));

        // 3. Cria o Usuário
        User admin = new User();
        admin.setEmail("admin@admin.com");
        admin.setPassword(passwordEncoder.encode("admin123")); // <--- O Pulo do Gato: Criptografia
        admin.setRole(adminRole);

        // O PublicId é gerado automaticamente na Entidade, então não precisa setar

        userRepository.save(admin);

        System.out.println(">>> SEED: Usuário Admin criado com sucesso! (admin@admin.com / admin123)");
    }
}