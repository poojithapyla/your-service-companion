# Memory: index.md
Updated: now

Service booking app (ServiBook) - coral/amber warm palette, DM Sans + Playfair Display fonts, rounded-2xl cards
- Primary: coral (16 85% 58%), Secondary: amber (35 90% 55%), Accent: teal (160 45% 45%)
- 5 categories: Home, Repairs & Installations, Beauty & Grooming, Décor, Packers & Movers
- Roles: Customer, Service Partner, Admin (user 428249bb gets admin)
- Lovable Cloud connected - Supabase for auth, DB, storage
- Currency: INR (₹), pricing in src/lib/pricing.ts
- booking-photos bucket is public
- 1 email = 1 role (user OR partner, not both)
- Partner phone required at signup, stored in profiles & booking on accept
- Real-time subscriptions on bookings table for partner & customer dashboards
- PWA manifest at public/manifest.json (installable, no service worker)
- Browser push notifications for partners on new bookings
- Packers & Movers: item-based pricing, mandatory from/to address and item list, no tools
