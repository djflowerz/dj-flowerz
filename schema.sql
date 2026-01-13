
-- =====================================================
-- DJ FLOWERZ DATABASE SCHEMA UPDATE
-- Run this in your InsForge SQL Dashboard
-- =====================================================

-- 1. CORE TABLES FOR PAYMENTS & SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    paystack_customer_code TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    product_id UUID REFERENCES public.products(id),
    customer_email TEXT,
    amount_kes DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending',
    reference TEXT UNIQUE,
    plan_code TEXT,
    shipping_address JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add columns if table already exists
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id);

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT;

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS plan_code TEXT;

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- 2. MEDIA STORAGE COLUMNS
-- =====================================================

-- Products: Store multiple image URLs in an array
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Mixtapes/Music Pool: Store a single cover image URL
ALTER TABLE public.mixtapes 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE public.pool_tracks 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 3. ADD TIMESTAMPS TO EXISTING TABLES
-- =====================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.mixtapes 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.pool_tracks 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 4. VERIFY TABLES EXIST
-- =====================================================

CREATE TABLE IF NOT EXISTS public.pool_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    artist TEXT,
    cover_image TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    price DECIMAL,
    type TEXT CHECK (type IN ('physical', 'digital')),
    digital_file_path TEXT,
    weight_kg DECIMAL,
    images TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add columns if table already exists
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('physical', 'digital'));

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS digital_file_path TEXT;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL;

CREATE TABLE IF NOT EXISTS public.mixtapes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    cover_image TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STORAGE BUCKET SETUP INSTRUCTIONS
-- =====================================================
-- 1. Go to Storage > Buckets in your InsForge Dashboard
-- 2. Click "Create New Bucket"
-- 3. Name: default
-- 4. Permissions: Public (required for download links)
-- =====================================================

-- =====================================================
-- SUBSCRIPTION MANAGEMENT COLUMNS
-- =====================================================

-- Add subscription tracking columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_code TEXT;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan_code TEXT;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_valid_until TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS will_renew BOOLEAN DEFAULT true;

-- Create indexes for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_status 
ON public.users(subscription_status);

CREATE INDEX IF NOT EXISTS idx_users_email 
ON public.users(email);
