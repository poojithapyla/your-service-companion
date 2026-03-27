
-- Add saved_address from partner signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  signup_role text;
  actual_role app_role;
  cats text[];
BEGIN
  signup_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  IF signup_role = 'partner' THEN
    actual_role := 'partner';
  ELSE
    actual_role := 'user';
  END IF;

  IF NEW.raw_user_meta_data->'partner_categories' IS NOT NULL THEN
    SELECT array_agg(elem::text) INTO cats
    FROM jsonb_array_elements_text(NEW.raw_user_meta_data->'partner_categories') AS elem;
  ELSE
    cats := '{}';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, partner_categories, phone, saved_address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    cats,
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''), ''),
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'address', ''), '')
  );
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, actual_role);
  RETURN NEW;
END;
$$;
