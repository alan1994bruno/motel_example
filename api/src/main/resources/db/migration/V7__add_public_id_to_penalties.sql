-- Habilita extensão para gerar UUID no banco (caso já tenha dados, ele preenche sozinho)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE penalties
ADD COLUMN public_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Garante que não tenha dois iguais
ALTER TABLE penalties
ADD CONSTRAINT uq_penalties_public_id UNIQUE (public_id);