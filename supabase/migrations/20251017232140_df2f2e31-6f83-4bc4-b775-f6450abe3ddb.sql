-- Step 1: Add professor role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'professor';