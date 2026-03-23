
-- Allow partners to view bookings that match their categories
-- We need a function to check if a booking's services overlap with a partner's categories
CREATE OR REPLACE FUNCTION public.booking_matches_partner_categories(_booking_services jsonb, _partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p,
         jsonb_array_elements(_booking_services) AS svc
    WHERE p.id = _partner_id
      AND (svc->>'categoryId') = ANY(p.partner_categories)
  )
$$;

-- Add RLS policy for partners to view matching bookings
CREATE POLICY "Partners can view category-matching bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'partner') 
  AND booking_matches_partner_categories(services, auth.uid())
);

-- Partners can update bookings assigned to them
CREATE POLICY "Partners can update assigned bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'partner') 
  AND assigned_partner_id = auth.uid()
);
