ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS assigned_partner_name text,
ADD COLUMN IF NOT EXISTS assigned_partner_phone text;

CREATE OR REPLACE FUNCTION public.partner_can_view_customer_booking_partner_profile(_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.assigned_partner_id = _profile_id
      AND b.user_id = auth.uid()
      AND b.status IN ('accepted', 'in_progress', 'completed')
  );
$$;

DROP POLICY IF EXISTS "Customers can view assigned partner profiles" ON public.profiles;
CREATE POLICY "Customers can view assigned partner profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(id, 'partner')
  AND public.partner_can_view_customer_booking_partner_profile(id)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  INSERT INTO public.profiles (id, full_name, avatar_url, partner_categories, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    cats,
    NULLIF(COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''), '')
  );
  
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, actual_role);
  RETURN NEW;
END;
$$;

ALTER TABLE public.bookings REPLICA IDENTITY FULL;