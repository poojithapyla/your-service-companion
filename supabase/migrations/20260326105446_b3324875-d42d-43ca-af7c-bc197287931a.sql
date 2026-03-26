UPDATE storage.buckets SET public = true WHERE id = 'booking-photos';

DROP POLICY IF EXISTS "Authenticated users can upload booking photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload booking photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'booking-photos');

DROP POLICY IF EXISTS "Anyone can view booking photos" ON storage.objects;
CREATE POLICY "Anyone can view booking photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'booking-photos');

DROP POLICY IF EXISTS "Users can delete own booking photos" ON storage.objects;
CREATE POLICY "Users can delete own booking photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'booking-photos' AND (storage.foldername(name))[1] = auth.uid()::text);