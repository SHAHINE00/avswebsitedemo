-- Promote current users to admin role if they need access
-- You can change the email to match your account

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'ghhgffgf@gmail.com';

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'belmadanimamine@gmail.com';