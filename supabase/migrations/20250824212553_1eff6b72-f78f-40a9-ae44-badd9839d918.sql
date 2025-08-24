-- Fix linter issue: Function Search Path Mutable
-- Recreate function with explicit search_path set to 'public'
CREATE OR REPLACE FUNCTION public.update_campaign_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;