
console.log("--- SQL SETUP INSTRUCTIONS ---");
console.log("Please copy and run the following SQL commands in your InsForge SQL Dashboard to enable backend tables and columns:");
console.log("");
console.log(`-- 1. Create Users & Orders (Essential for Payments)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    paystack_customer_code TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    amount_kes DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending',
    reference TEXT UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create other missing tables
CREATE TABLE IF NOT EXISTS public.pool_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add timestamps to existing tables (prevents 400 sorting errors)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.mixtapes ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
`);
console.log("");
console.log("--- STORAGE SETUP ---");
console.log("1. Go to Storage > Buckets");
console.log("2. Create a bucket named 'default'");
console.log("3. Set it to Public");
