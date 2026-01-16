package com.motel.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "files")
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore // Segurança: ID interno oculto
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @Column(nullable = false)
    private String url;

    // Construtor utilitário para facilitar no Service
    public File() {}
    public File(String url) {
        this.url = url;
    }
}