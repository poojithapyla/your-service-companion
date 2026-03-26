// INR pricing engine — market-competitive rates for Indian cities

const SERVICE_PRICES: Record<string, number> = {
  // Home Services
  "Deep Cleaning": 999,
  "Regular Cleaning": 499,
  "Bathroom Cleaning": 349,
  "Kitchen Cleaning": 499,
  "Kitchen Sink Cleaning": 199,
  "Sofa Cleaning": 599,
  "Carpet Cleaning": 699,
  "Mopping": 199,
  "Cooking": 349,
  "Meal Prep": 299,
  "Chopping": 149,
  "Laundry": 299,
  "Ironing": 199,
  "Folding Clothes": 149,
  "Arranging Things": 249,
  "Wardrobe Organization": 399,
  "Home Sanitization": 999,
  "Window Cleaning": 149,
  "Pest Control": 899,
  "Water Tank Cleaning": 799,
  "Dusting": 149,
  "Dishwashing": 149,
  "Balcony Cleaning": 299,
  "Fridge Cleaning": 299,

  // Technical / Repairs & Installations
  "Plumbing - Leak Fix": 299,
  "Plumbing - Tap Installation": 249,
  "Plumbing - Drain Cleaning": 349,
  "Plumbing - Toilet Repair": 399,
  "Electrical - Wiring": 399,
  "Electrical - Switch/Socket": 149,
  "Electrical - Fan Installation": 349,
  "Electrical - Light Fixture": 249,
  "Appliance Repair - Washing Machine": 499,
  "Appliance Repair - Refrigerator": 549,
  "Appliance Repair - Microwave": 399,
  "AC Service - Regular": 499,
  "AC Service - Gas Refill": 1499,
  "AC Installation": 1299,
  "Inverter/UPS Repair": 499,
  "CCTV Installation": 999,
  "Geyser Repair": 449,
  "Carpentry Work": 499,
  "Painting": 999,
  "Furniture Assembly": 349,

  // Beauty & Grooming
  "Men's Haircut": 199,
  "Women's Haircut": 349,
  "Kids Haircut": 149,
  "Hair Coloring": 999,
  "Hair Straightening": 1499,
  "Hair Spa Treatment": 799,
  "Keratin Treatment": 2499,
  "Nail Art": 499,
  "Manicure": 349,
  "Pedicure": 399,
  "Facial - Basic": 499,
  "Facial - Premium": 999,
  "Waxing - Full Body": 999,
  "Waxing - Partial": 399,
  "Threading": 49,
  "Bridal Makeup": 4999,
  "Party Makeup": 1999,
  "Mehendi/Henna": 499,
  "Men's Grooming": 399,
  "Massage Therapy": 799,

  // Décor Services
  "Birthday Décor - Basic": 1999,
  "Birthday Décor - Premium": 4999,
  "Birthday Décor - Kids Theme": 3499,
  "Party Setup - House Party": 2999,
  "Party Setup - Garden Party": 4999,
  "Party Setup - Corporate Event": 7999,
  "Surprise Décor - Room": 2499,
  "Surprise Décor - Rooftop": 3999,
  "Surprise Décor - Car": 1499,
  "Candlelight Dinner Décor - Indoor": 2999,
  "Candlelight Dinner Décor - Outdoor": 4499,
  "Anniversary Décor": 2999,
  "Baby Shower Décor": 3499,
  "Housewarming Décor": 2499,
  "Festival Décor": 1999,
  "Wedding Décor - Small": 9999,

  // Other
  "Custom Request": 499,
  "Consultation": 199,
  "Special Event Planning": 1999,
  "Errand Service": 199,
  "Pet Care": 399,
  "Gardening": 349,
  "Moving Help": 999,
  "Grocery Shopping": 99,
  "Document Delivery": 99,
};

const DEFAULT_PRICE = 399;

export function getServicePrice(serviceName: string): number {
  return SERVICE_PRICES[serviceName] ?? DEFAULT_PRICE;
}

export interface BookingServiceGroup {
  serviceNames: string[];
  quantities: Record<string, number>;
}

export function calculateBookingEstimate(serviceGroups: BookingServiceGroup[]): number {
  return serviceGroups.reduce((total, group) => {
    return total + group.serviceNames.reduce((sum, name) => {
      const base = getServicePrice(name);
      const qty = group.quantities[name] || 1;
      return sum + base * qty;
    }, 0);
  }, 0);
}
