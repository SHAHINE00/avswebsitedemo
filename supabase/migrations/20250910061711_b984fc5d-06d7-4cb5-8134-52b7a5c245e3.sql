-- Backfill phone numbers from subscribers to profiles
UPDATE profiles 
SET phone = subscribers.phone,
    updated_at = now()
FROM subscribers
WHERE profiles.email = subscribers.email 
  AND subscribers.phone IS NOT NULL 
  AND profiles.phone IS NULL;