-- ============================================================================
-- LOCALIST - MIGRATION: Add Rating Columns and Auto-Update Trigger
-- ============================================================================
-- Este script adiciona colunas de rating na tabela map_pins e cria um trigger
-- que atualiza automaticamente a média quando reviews são criadas/editadas/deletadas
-- ============================================================================

-- PASSO 1: Adicionar colunas de rating na tabela map_pins
-- ============================================================================
ALTER TABLE map_pins 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Adicionar comentários para documentação
COMMENT ON COLUMN map_pins.average_rating IS 'Média das avaliações (0.00 a 5.00), atualizada automaticamente via trigger';
COMMENT ON COLUMN map_pins.rating_count IS 'Número total de avaliações, atualizado automaticamente via trigger';


-- PASSO 2: Criar função que recalcula o rating
-- ============================================================================
CREATE OR REPLACE FUNCTION update_pin_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_pin_id UUID;
BEGIN
  -- Determinar qual pin_id usar (funciona para INSERT, UPDATE e DELETE)
  target_pin_id := COALESCE(NEW.pin_id, OLD.pin_id);
  
  -- Atualizar average_rating e rating_count do pin
  UPDATE map_pins
  SET 
    average_rating = COALESCE(
      (SELECT ROUND(AVG(rating)::numeric, 2)
       FROM map_reviews
       WHERE pin_id = target_pin_id),
      0.00
    ),
    rating_count = COALESCE(
      (SELECT COUNT(*)::integer
       FROM map_reviews
       WHERE pin_id = target_pin_id),
      0
    ),
    updated_at = NOW()
  WHERE id = target_pin_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Adicionar comentário na função
COMMENT ON FUNCTION update_pin_rating() IS 'Recalcula average_rating e rating_count quando uma review é criada/atualizada/deletada';


-- PASSO 3: Criar trigger na tabela map_reviews
-- ============================================================================
-- Remove trigger existente se houver
DROP TRIGGER IF EXISTS update_pin_rating_trigger ON map_reviews;

-- Cria novo trigger
CREATE TRIGGER update_pin_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON map_reviews
FOR EACH ROW
EXECUTE FUNCTION update_pin_rating();

-- Adicionar comentário no trigger
COMMENT ON TRIGGER update_pin_rating_trigger ON map_reviews IS 'Atualiza automaticamente o rating do pin quando uma review muda';


-- PASSO 4: Calcular ratings para pins existentes (executar uma vez)
-- ============================================================================
-- Este UPDATE calcula os ratings de todos os pins que já têm reviews
UPDATE map_pins p
SET 
  average_rating = COALESCE(
    (SELECT ROUND(AVG(r.rating)::numeric, 2)
     FROM map_reviews r
     WHERE r.pin_id = p.id),
    0.00
  ),
  rating_count = COALESCE(
    (SELECT COUNT(*)::integer
     FROM map_reviews r
     WHERE r.pin_id = p.id),
    0
  ),
  updated_at = NOW();


-- PASSO 5: Criar índice para melhorar performance
-- ============================================================================
-- Índice para ordenar pins por rating (útil para "melhores avaliados")
CREATE INDEX IF NOT EXISTS idx_map_pins_average_rating 
ON map_pins(average_rating DESC) 
WHERE average_rating > 0;

-- Índice composto para buscar pins por localização E rating
CREATE INDEX IF NOT EXISTS idx_map_pins_location_rating 
ON map_pins(latitude, longitude, average_rating DESC);


-- ============================================================================
-- VERIFICAÇÃO: Queries para testar se funcionou
-- ============================================================================

-- Ver pins com suas médias (top 10 melhores avaliados)
SELECT 
  name,
  average_rating,
  rating_count,
  created_at
FROM map_pins
WHERE rating_count > 0
ORDER BY average_rating DESC, rating_count DESC
LIMIT 10;

-- Contar pins por faixa de rating
WITH rating_categories AS (
  SELECT 
    CASE 
      WHEN average_rating = 0 THEN 'Sem avaliações'
      WHEN average_rating >= 4.0 THEN 'Excelente (4.0-5.0)'
      WHEN average_rating >= 2.5 THEN 'Bom (2.5-3.9)'
      WHEN average_rating >= 1.5 THEN 'Regular (1.5-2.4)'
      ELSE 'Ruim (0.0-1.4)'
    END as rating_category,
    CASE 
      WHEN average_rating = 0 THEN 5
      WHEN average_rating >= 4.0 THEN 1
      WHEN average_rating >= 2.5 THEN 2
      WHEN average_rating >= 1.5 THEN 3
      ELSE 4
    END as sort_order
  FROM map_pins
)
SELECT 
  rating_category,
  COUNT(*) as pin_count
FROM rating_categories
GROUP BY rating_category, sort_order
ORDER BY sort_order;

-- ============================================================================
-- TESTE DO TRIGGER: Criar uma review de teste e verificar
-- ============================================================================
-- ATENÇÃO: Substitua os UUIDs pelos IDs reais do seu banco
-- 
-- -- 1. Inserir review de teste
-- INSERT INTO map_reviews (pin_id, user_id, rating, comment)
-- VALUES (
--   'SEU_PIN_ID_AQUI',
--   'SEU_USER_ID_AQUI', 
--   5,
--   'Teste do trigger automático'
-- );
-- 
-- -- 2. Verificar se o pin foi atualizado
-- SELECT name, average_rating, rating_count 
-- FROM map_pins 
-- WHERE id = 'SEU_PIN_ID_AQUI';
-- 
-- -- 3. Deletar review de teste
-- DELETE FROM map_reviews 
-- WHERE comment = 'Teste do trigger automático';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
