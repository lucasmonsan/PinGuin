-- Fix photos column to match TypeScript types
-- Change from photo_url TEXT to photos TEXT[]

-- Drop the old column
ALTER TABLE map_pins DROP COLUMN IF EXISTS photo_url;

-- Add the new column with correct type
ALTER TABLE map_pins ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- Add missing columns that exist in TypeScript but not in schema
ALTER TABLE map_pins ADD COLUMN IF NOT EXISTS osm_id BIGINT;
ALTER TABLE map_pins ADD COLUMN IF NOT EXISTS osm_type VARCHAR(50);

-- Add missing columns to reviews table
ALTER TABLE map_reviews ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE map_reviews ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;
