-- Fix seed user passwords to use bcrypt hash for "passord123"
UPDATE users SET password_hash = '$2a$10$Hy8yOJ7xXox6pNf74G7XIeYf3/hvk.9V04cWzywe4cccvHjsnHMNC'
WHERE email IN ('test@babypakka.no', 'admin@babypakka.no');
