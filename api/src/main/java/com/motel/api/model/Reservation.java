package com.motel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID publicId = UUID.randomUUID();

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDateTime checkinTime;

    @Column(nullable = false)
    private LocalDateTime checkoutTime;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Boolean occupied = false; // Valor padrão no Java também

    @Column(nullable = false)
    private Boolean penaltyApplied = false;

    @Column(nullable = false)
    private Boolean cancelled = false;

    private LocalDateTime cancelledAt;

    public LocalDateTime getCheckinTime() {
        return checkinTime;
    }

    // Getters e Setters
    public Boolean getCancelled() {
        return cancelled;
    }

    public void setCancelled(Boolean cancelled) {
        this.cancelled = cancelled;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    // Getters e Setters
    public Boolean getPenaltyApplied() {
        return penaltyApplied;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPenaltyApplied(Boolean penaltyApplied) {
        this.penaltyApplied = penaltyApplied;
    }

    public Boolean getOccupied() {
        return occupied;
    }

    public void setOccupied(Boolean occupied) {
        this.occupied = occupied;
    }


    public void setUser(User user) {
        this.user = user;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setCheckinTime(LocalDateTime checkinTime) {
        this.checkinTime = checkinTime;
    }

    public void setCheckoutTime(LocalDateTime checkoutTime) {
        this.checkoutTime = checkoutTime;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getPrice() {
        return price;
    }
}