DROP TABLE IF EXISTS penalties;

CREATE TABLE penalties (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,

    -- Relacionamento com Usuário
    CONSTRAINT fk_penalties_user FOREIGN KEY (user_id) REFERENCES users(id)
);