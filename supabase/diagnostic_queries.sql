-- ============================================================================
-- LOCALIST - QUERIES DE DIAGNÓSTICO DO SUPABASE
-- ============================================================================
-- Execute estas queries no Supabase SQL Editor e me envie os resultados
-- para eu ter contexto completo do seu banco de dados
-- ============================================================================

-- QUERY 1: Listar todas as tabelas
-- ============================================================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;


-- QUERY 2: Estrutura completa de todas as tabelas
-- ============================================================================
SELECT 
  table_name,
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;


-- QUERY 3: Ver todos os índices
-- ============================================================================
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;


-- QUERY 4: Ver todas as foreign keys (relacionamentos)
-- ============================================================================
SELECT
  tc.table_name as from_table,
  kcu.column_name as from_column,
  ccu.table_name AS to_table,
  ccu.column_name AS to_column,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;


-- QUERY 5: Estatísticas das tabelas principais
-- ============================================================================
SELECT 
  'map_pins' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN average_rating > 0 THEN 1 END) as pins_with_rating,
  ROUND(AVG(average_rating)::numeric, 2) as overall_avg_rating
FROM map_pins
UNION ALL
SELECT 
  'map_reviews' as table_name,
  COUNT(*) as total_records,
  NULL as pins_with_rating,
  ROUND(AVG(rating)::numeric, 2) as overall_avg_rating
FROM map_reviews
UNION ALL
SELECT 
  'map_favorites' as table_name,
  COUNT(*) as total_records,
  NULL as pins_with_rating,
  NULL as overall_avg_rating
FROM map_favorites
UNION ALL
SELECT 
  'map_pin_categories' as table_name,
  COUNT(*) as total_records,
  NULL as pins_with_rating,
  NULL as overall_avg_rating
FROM map_pin_categories;


-- QUERY 6: Sample de dados (5 pins com reviews)
-- ============================================================================
SELECT 
  p.id,
  p.name,
  p.average_rating,
  p.rating_count,
  p.latitude,
  p.longitude,
  c.name as category_name,
  c.color as category_color
FROM map_pins p
LEFT JOIN map_pin_categories c ON c.id = p.category_id
WHERE p.rating_count > 0
ORDER BY p.average_rating DESC
LIMIT 5;


-- ============================================================================
-- INSTRUÇÕES:
-- ============================================================================
-- 1. Execute cada query separadamente no Supabase SQL Editor
-- 2. Copie os resultados de cada uma
-- 3. Me envie os resultados para eu ter contexto completo
-- 4. Depois execute o arquivo add_pin_rating_columns.sql
-- ============================================================================
