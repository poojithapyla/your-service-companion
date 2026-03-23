
-- Add 'partner' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';

-- Update handle_new_user to assign role from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  signup_role text;
  actual_role app_role;
  cats text[];
BEGIN
  signup_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Map signup role to app_role enum
  IF signup_role = 'partner' THEN
    actual_role := 'partner';
  ELSE
    actual_role := 'user';
  END IF;

  -- Extract partner categories if any
  IF NEW.raw_user_meta_data->'partner_categories' IS NOT NULL THEN
    SELECT array_agg(elem::text) INTO cats
    FROM jsonb_array_elements_text(NEW.raw_user_meta_data->'partner_categories') AS elem;
  ELSE
    cats := '{}';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, partner_categories)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    cats
  );
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, actual_role);
  RETURN NEW;
END;
$$;
