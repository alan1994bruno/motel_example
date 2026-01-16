package com.motel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @Enumerated(EnumType.STRING) // Salva como texto "ADMIN" no banco
    private Level level;

    public enum Level {
        ADMIN,
        CLIENT
    }

    public Level getLevel() {
        return level;
    }
}
