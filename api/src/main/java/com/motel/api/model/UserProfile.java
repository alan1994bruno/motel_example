package com.motel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @Column(unique = true)
    private String cpf;
    private String cep;
    private String phone;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getCpf() {
        return cpf;
    }
}