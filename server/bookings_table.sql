CREATE TABLE IF NOT EXISTS public.bookings (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventType" TEXT,
    "eventDate" DATE,
    "budget" TEXT,
    "location" TEXT,
    "details" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
