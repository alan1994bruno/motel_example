package com.motel.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @ManyToOne // Vários usuários podem ter o mesmo Role (Admin ou Client)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;


    @OneToOne(mappedBy = "user")
    @JsonIgnoreProperties("user") // <--- EVITA LOOP INFINITO (User -> Penalty -> User)
    private Penalty penalty;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public String getEmail() {
        return email;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public Role getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public Penalty getPenalty() {
        return penalty;
    }

    public void setPenalty(Penalty penalty) {
        this.penalty = penalty;
    }

    public UserProfile getProfile() {
        return profile;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converte nosso Enum (ADMIN) para o padrão do Spring (ROLE_ADMIN)
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getLevel().name()));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }




    @Override
    public String getUsername() {
        return email; // Nosso login é o email
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}