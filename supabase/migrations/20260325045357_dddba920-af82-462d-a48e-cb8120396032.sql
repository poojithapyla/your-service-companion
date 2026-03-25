-- Create a private bucket for booking photos
insert into storage.buckets (id, name, public)
values ('booking-photos', 'booking-photos', false)
on conflict (id) do nothing;

-- Storage policies for authenticated users' booking uploads
create policy "Authenticated users can upload booking photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'booking-photos'
  and auth.uid() is not null
);

create policy "Users can view booking photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'booking-photos'
);

create policy "Users can update booking photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'booking-photos'
  and auth.uid() is not null
);

create policy "Users can delete booking photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'booking-photos'
  and auth.uid() is not null
);

-- Allow partners to accept/reject matching pending bookings and continue updating their assigned jobs
create policy "Partners can manage matching bookings"
on public.bookings
for update
to authenticated
using (
  public.has_role(auth.uid(), 'partner')
  and (
    assigned_partner_id = auth.uid()
    or (
      assigned_partner_id is null
      and status = 'pending'
      and public.booking_matches_partner_categories(services, auth.uid())
    )
  )
)
with check (
  public.has_role(auth.uid(), 'partner')
  and (
    assigned_partner_id = auth.uid()
    or (
      assigned_partner_id is null
      and status in ('pending', 'rejected')
      and public.booking_matches_partner_categories(services, auth.uid())
    )
  )
);

-- Let users store partner phone numbers and theme safely
alter table public.profiles
alter column phone drop not null;

-- Keep updated_at fresh on profile edits
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();