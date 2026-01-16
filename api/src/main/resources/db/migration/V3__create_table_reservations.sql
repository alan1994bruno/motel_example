DROP TABLE IF EXISTS reservations;

CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,

    -- Relacionamentos
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,

    -- Horários (TIMESTAMP guarda Data e Hora)
    checkin_time TIMESTAMP NOT NULL,
    checkout_time TIMESTAMP NOT NULL,

    -- Valor calculado
    price DECIMAL(10, 2) NOT NULL,

    -- Chaves Estrangeiras (FK)
    CONSTRAINT fk_reservation_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_reservation_room FOREIGN KEY (room_id) REFERENCES rooms(id)
);