# Memory: index.md
Updated: now

Service booking app (ServiBook) - coral/amber warm palette, DM Sans + Playfair Display fonts, rounded-2xl cards
- Primary: coral (16 85% 58%), Secondary: amber (35 90% 55%), Accent: teal (160 45% 45%)
- 5 categories: Home, Technical (Repairs & Installations), Personal (Beauty & Grooming), Decoration, Other/Custom
- Roles: Customer (user), Service Partner (partner), Admin - stored in user_roles table
- 1 email = 1 role: customers cannot access partner pages and vice versa
- Partner sees only bookings matching their selected categories (RLS enforced)
- Customer gets profile dropdown in header (avatar, bookings, settings)
- Partner gets partner dashboard link, no "Book a Service" option
- Lovable Cloud connected for auth, DB, payments
- Admin user: 428249bb-1403-47f3-9e91-6ee7e2dd2a9d (poojithapyla.11@gmail.com)
- Photo required: haircuts, hair coloring, sofa cleaning, nail art, mehendi, all décor services
- Notes mandatory: cooking (curry/dish), painting (color combos)
- Quantity fields: bathroom cleaning, window cleaning, tap/switch/fan/light/CCTV installation
- Realtime enabled on bookings table
- Bookings saved to DB on confirm, no login prompt if authenticated
- Password: 8+ chars, uppercase, number, special char
