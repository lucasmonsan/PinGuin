-- ============================================
-- Map Database Seed Data
-- ============================================

-- Insert default pin categories
INSERT INTO map_pin_categories (name, icon, color) VALUES
  ('Restaurante', '🍽️', '#FF6B6B'),
  ('Café', '☕', '#8B4513'),
  ('Parque', '🌳', '#4ECDC4'),
  ('Museu', '🏛️', '#95E1D3'),
  ('Shopping', '🛍️', '#F38181'),
  ('Academia', '💪', '#AA96DA'),
  ('Hospital', '🏥', '#FF5252'),
  ('Escola', '🎓', '#FCBF49'),
  ('Mercado', '🛒', '#06FFA5'),
  ('Cinema', '🎬', '#B565D8'),
  ('Bar', '🍺', '#FFA500'),
  ('Hotel', '🏨', '#6C5CE7'),
  ('Praia', '🏖️', '#74B9FF'),
  ('Igreja', '⛪', '#DFE6E9'),
  ('Posto', '⛽', '#636E72'),
  ('Banco', '🏦', '#00B894'),
  ('Farmácia', '💊', '#00CEC9'),
  ('Outro', '📍', '#A29BFE')
ON CONFLICT (name) DO NOTHING;

