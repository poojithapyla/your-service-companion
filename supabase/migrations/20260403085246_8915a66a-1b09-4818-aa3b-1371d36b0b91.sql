ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spoken_languages text[] DEFAULT '{}'::text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;