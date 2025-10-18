-- Add RLS policy to allow users to read their own roles
-- This is critical for the is_professor() function to work correctly

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;

-- Create policy allowing authenticated users to see their own roles
CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Verify the policy was created
COMMENT ON POLICY "Users can read their own roles" ON public.user_roles IS 
'Allows authenticated users to read their own role assignments. Required for is_professor() and similar role check functions to work correctly.';