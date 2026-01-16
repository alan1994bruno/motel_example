package com.motel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal; // Importante para dinheiro
import java.util.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal hourlyRate;

    @Column(nullable = false)
    private Integer units;


    // --- ADICIONE ISSO ---
    @ManyToMany(cascade = CascadeType.ALL) // Salva os arquivos junto com o quarto
    @JoinTable(
            name = "room_files", // Nome da tabela intermediária
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "file_id")
    )
    private List<File> images = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public Integer getUnits() {
        return units;
    }

    public void setUnits(Integer units) {
        this.units = units;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public Long getId() {
        return id;
    }

    public void setImages(List<File> images) {
        this.images = images;
    }
}