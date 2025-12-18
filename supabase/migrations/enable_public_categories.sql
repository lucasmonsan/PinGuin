-- Enable public read access for pin categories
-- This allows unauthenticated users to view available categories

-- Enable RLS on the table (if not already enabled)
ALTER TABLE map_pin_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to categories" ON map_pin_categories;

-- Create policy to allow anyone to read categories
CREATE POLICY "Allow public read access to categories"
ON map_pin_categories
FOR SELECT
TO public
USING (true);

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'map_pin_categories';
