-- 1. Tabela de Roles (Níveis de Acesso)
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    level VARCHAR(50) NOT NULL UNIQUE -- Ex: 'ADMIN', 'CLIENT'
);

-- Vamos já deixar os niveis criados
INSERT INTO roles (public_id, level) VALUES (gen_random_uuid(), 'ADMIN');
INSERT INTO roles (public_id, level) VALUES (gen_random_uuid(), 'CLIENT');

-- 2. Tabela de Usuários
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- Relacionamento com Roles (Muitos para Um neste caso simples)
    role_id BIGINT NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Tabela de Perfis (User Profiles)
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    cpf VARCHAR(14),
    cep VARCHAR(10),
    phone VARCHAR(20),

    -- Relacionamento 1 para 1 com Users
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);