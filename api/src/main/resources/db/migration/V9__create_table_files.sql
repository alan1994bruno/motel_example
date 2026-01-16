DROP TABLE IF EXISTS room_files CASCADE;
DROP TABLE IF EXISTS files CASCADE;

-- 1. Tabela de Arquivos (Imagens)
CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    url VARCHAR(500) NOT NULL
);

-- 2. Tabela Intermediária (Conecta Quartos <-> Arquivos)
CREATE TABLE room_files (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(), -- Gera sozinho

    room_id BIGINT NOT NULL,
    file_id BIGINT NOT NULL,

    CONSTRAINT fk_rf_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_rf_file FOREIGN KEY (file_id) REFERENCES files(id)
);