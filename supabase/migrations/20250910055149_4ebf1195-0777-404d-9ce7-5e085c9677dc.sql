-- Add phone column to profiles table
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

-- Update the approve-pending-user function to include phone transfer
-- This will be handled in the edge function code separately

-- Create index for phone lookups (optional but good for performance)
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Update existing profiles with phone numbers from pending_users where possible
-- This is a data backfill operation
UPDATE public.profiles 
SET phone = pu.phone
FROM public.pending_users pu
WHERE public.profiles.email = pu.email
  AND public.profiles.phone IS NULL
  AND pu.phone IS NOT NULL;