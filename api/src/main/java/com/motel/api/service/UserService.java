package com.motel.api.service;

import com.motel.api.dto.UserRegistrationDTO;
import com.motel.api.dto.UserUpdateDTO;
import com.motel.api.model.Role;
import com.motel.api.model.User;
import com.motel.api.model.UserProfile;
import com.motel.api.repository.RoleRepository;
import com.motel.api.repository.UserProfileRepository;
import com.motel.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private  final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder,UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userProfileRepository=userProfileRepository;
    }

    @Transactional // Garante que salva tudo ou nada
    public User registerUser(UserRegistrationDTO data) {
        // 1. Verifica se a Role existe (ADMIN ou CLIENT)
        Role role = roleRepository.findByLevel(Role.Level.valueOf("CLIENT"))
                .orElseThrow(() -> new RuntimeException("Nível de acesso não encontrado!"));

        // 2. REGRA DE NEGÓCIO: Validação de Cliente
        if (role.getLevel() == Role.Level.CLIENT) {
            if (data.cpf() == null || data.cpf().isBlank()) {
                throw new IllegalArgumentException("Erro: Clientes DEVEM informar o CPF.");
            }
            if (data.phone() == null || data.phone().isBlank()) {
                throw new IllegalArgumentException("Erro: Clientes DEVEM informar o telefone.");
            }
        }

        // 3. Verifica se email já existe
        if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        // 4. Cria o Usuário
        User newUser = new User();
        newUser.setEmail(data.email());

        String senhaCriptografada = passwordEncoder.encode(data.password());
        newUser.setPassword(senhaCriptografada);



        ; // Obs: Num app real, usaremos BCrypt aqui depois
        newUser.setRole(role);

        // 5. Se for CLIENT ou se mandou dados, cria o Profile
        // (A regra diz que Admin NÃO PRECISA, mas se mandar, a gente salva ou ignora?
        // Aqui vou salvar se vier preenchido, mas só validar se for Client)
        if (role.getLevel() == Role.Level.CLIENT || (data.cpf() != null)) {
            UserProfile profile = new UserProfile();
            profile.setCpf(data.cpf());
            profile.setCep(data.cep());
            profile.setPhone(data.phone());
            profile.setUser(newUser); // Liga um ao outro

            newUser.setProfile(profile);
        }

        return userRepository.save(newUser);
    }


    public Page<User> findAllClients(int pageNumber) {
        // Regra de Negócio: Página 1 do usuário = Página 0 do Spring
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        int springPage = pageNumber - 1;

        // Configuração: Página X, 10 itens, Ordenado por 'email' ASC (A-Z)
        Pageable pageable = PageRequest.of(springPage, 10, Sort.by("id").ascending());

        return userRepository.findByRoleLevel(Role.Level.CLIENT, pageable);
    }


    public Page<User> findPenalizedUsers(int pageNumber) {
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        int springPage = pageNumber - 1;

        // Ordena por email (A-Z)
        Pageable pageable = PageRequest.of(springPage, 10, Sort.by("id").ascending());

        return userRepository.findUsersWithPenalties(pageable);
    }


    public User findByPublicId(UUID publicId) {
        return userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    @Transactional
    public User updateUser(UUID publicId, UserUpdateDTO data) {
        User user = findByPublicId(publicId);
        System.out.println("@@@@@"+user);

        if (data.cpf() != null && !data.cpf().equals(user.getProfile().getCpf())) {
            // Se o CPF mudou, verifica se já existe no banco em OUTRA pessoa
            boolean cpfExists = userProfileRepository.existsByCpfAndUserIdNot(data.cpf(), user.getId());

            if (cpfExists) {
                throw new IllegalArgumentException("Este CPF já está sendo usado por outro usuário.");
            }

            user.getProfile().setCpf(data.cpf());
        }

        // 1. Atualiza dados do USUÁRIO (Tabela users)
        if (data.email() != null && !data.email().isBlank()) {
            // Dica: Aqui seria bom verificar se o email já existe em outro user antes de trocar
            user.setEmail(data.email());
        }

        // 2. Atualiza Senha (Se enviada)
        if (data.password() != null && !data.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(data.password()));
        }

        // 3. Atualiza dados do PERFIL (Tabela user_profiles)
        if (user.getProfile() == null) {
            var profile = new UserProfile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        if (data.phone() != null) user.getProfile().setPhone(data.phone());
        if (data.cpf() != null)   user.getProfile().setCpf(data.cpf());
        if (data.cep() != null)   user.getProfile().setCep(data.cep());



        return userRepository.save(user);
    }
}