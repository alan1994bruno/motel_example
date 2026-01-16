-- Primeiro: Limpa duplicatas antigas (se houver) para não dar erro ao criar a regra
-- Mantém apenas a penalidade mais recente de cada usuário
DELETE FROM penalties p1
USING penalties p2
WHERE p1.id < p2.id AND p1.user_id = p2.user_id;

-- Segundo: Cria a trava. Agora o banco proíbe 2 linhas para o mesmo usuário.
ALTER TABLE penalties ADD CONSTRAINT uq_penalties_user_id UNIQUE (user_id);