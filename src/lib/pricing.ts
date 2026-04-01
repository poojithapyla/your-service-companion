// INR pricing engine — slightly below market rates for Indian cities

const SERVICE_PRICES: Record<string, number> = {
  // Home Services
  "Deep Cleaning": 799,
  "Regular Cleaning": 399,
  "Bathroom Cleaning": 249,
  "Kitchen Cleaning": 399,
  "Kitchen Sink Cleaning": 149,
  "Sofa Cleaning": 449,
  "Carpet Cleaning": 549,
  "Mopping": 149,
  "Cooking": 249,
  "Meal Prep": 199,
  "Chopping": 99,
  "Laundry": 199,
  "Ironing": 149,
  "Folding Clothes": 99,
  "Arranging Things": 149,
  "Wardrobe Organization": 299,
  "Home Sanitization": 799,
  "Window Cleaning": 99,
  "Pest Control": 699,
  "Water Tank Cleaning": 599,
  "Dusting": 99,
  "Dishwashing": 99,
  "Balcony Cleaning": 199,
  "Fridge Cleaning": 199,

  // Technical / Repairs & Installations
  "Plumbing - Leak Fix": 199,
  "Plumbing - Tap Installation": 149,
  "Plumbing - Drain Cleaning": 249,
  "Plumbing - Toilet Repair": 299,
  "Electrical - Wiring": 299,
  "Electrical - Switch/Socket": 99,
  "Electrical - Fan Installation": 249,
  "Electrical - Light Fixture": 149,
  "Appliance Repair - Washing Machine": 349,
  "Appliance Repair - Refrigerator": 399,
  "Appliance Repair - Microwave": 299,
  "AC Service - Regular": 349,
  "AC Service - Gas Refill": 1199,
  "AC Installation": 999,
  "Inverter/UPS Repair": 349,
  "CCTV Installation": 799,
  "Geyser Repair": 299,
  "Carpentry Work": 349,
  "Painting": 799,
  "Furniture Assembly": 249,

  // Beauty & Grooming
  "Men's Haircut": 149,
  "Women's Haircut": 249,
  "Kids Haircut": 99,
  "Hair Coloring": 799,
  "Hair Straightening": 1199,
  "Hair Spa Treatment": 599,
  "Keratin Treatment": 1999,
  "Nail Art": 349,
  "Manicure": 249,
  "Pedicure": 299,
  "Facial - Basic": 349,
  "Facial - Premium": 799,
  "Waxing - Full Body": 799,
  "Waxing - Partial": 299,
  "Threading": 29,
  "Bridal Makeup": 3999,
  "Party Makeup": 1499,
  "Mehendi/Henna": 349,
  "Men's Grooming": 299,
  "Massage Therapy": 599,

  // Décor Services
  "Birthday Décor - Basic": 1499,
  "Birthday Décor - Premium": 3999,
  "Birthday Décor - Kids Theme": 2499,
  "Party Setup - House Party": 1999,
  "Party Setup - Garden Party": 3499,
  "Party Setup - Corporate Event": 5999,
  "Surprise Décor - Room": 1799,
  "Surprise Décor - Rooftop": 2999,
  "Surprise Décor - Car": 999,
  "Candlelight Dinner Décor - Indoor": 1999,
  "Candlelight Dinner Décor - Outdoor": 3499,
  "Anniversary Décor": 1999,
  "Baby Shower Décor": 2499,
  "Housewarming Décor": 1799,
  "Festival Décor": 1499,
  "Wedding Décor - Small": 7999,

  // Packers & Movers — calculated per-item, these are base rates
  "Packers & Movers": 0, // dynamic pricing based on items

};

const DEFAULT_PRICE = 299;

// Packers & Movers per-item pricing
const PACKERS_ITEM_PRICES: Record<string, number> = {
  "Sofa (1-seater)": 500,
  "Sofa (2-seater)": 800,
  "Sofa (3-seater)": 1200,
  "Bed (Single)": 600,
  "Bed (Double)": 1000,
  "Bed (King)": 1500,
  "Wardrobe (Small)": 800,
  "Wardrobe (Large)": 1500,
  "Dining Table (4-seater)": 700,
  "Dining Table (6-seater)": 1000,
  "TV (up to 42\")": 400,
  "TV (above 42\")": 700,
  "Fridge": 800,
  "Washing Machine": 700,
  "AC (Split)": 900,
  "AC (Window)": 600,
  "Microwave": 300,
  "Boxes (Small)": 100,
  "Boxes (Medium)": 200,
  "Boxes (Large)": 350,
  "Two-Wheeler": 1500,
  "Cycle": 500,
  "Piano/Heavy Instrument": 2500,
  "Other Item": 300,
};

export const PACKERS_ITEMS = Object.keys(PACKERS_ITEM_PRICES);

export function getPackersEstimate(items: Record<string, number>): number {
  return Object.entries(items).reduce((total, [item, qty]) => {
    return total + (PACKERS_ITEM_PRICES[item] || 300) * qty;
  }, 0);
}

/** Percentage discount when the customer has ALL tools */
const ALL_TOOLS_DISCOUNT = 0.15;    // 15% off
/** Percentage discount per tool the customer already has */
const PER_TOOL_DISCOUNT = 0.05;     // 5% off per tool

export function getServicePrice(serviceName: string): number {
  return SERVICE_PRICES[serviceName] ?? DEFAULT_PRICE;
}

export interface BookingServiceGroup {
  serviceNames: string[];
  quantities: Record<string, number>;
  toolsWithUser?: string[];
  noneOfAboveTools?: boolean;
  totalTools?: number; // total tools for the service group
}

export function calculateBookingEstimate(serviceGroups: BookingServiceGroup[]): number {
  return serviceGroups.reduce((total, group) => {
    const groupTotal = group.serviceNames.reduce((sum, name) => {
      const base = getServicePrice(name);
      const qty = group.quantities[name] || 1;
      return sum + base * qty;
    }, 0);

    // Tool-based discount
    const totalTools = group.totalTools || 0;
    const userTools = group.toolsWithUser?.length || 0;

    if (group.noneOfAboveTools || totalTools === 0) {
      // Customer has no tools — no discount
      return total + groupTotal;
    }

    if (userTools >= totalTools && totalTools > 0) {
      // Customer has ALL tools — bigger discount
      return total + Math.round(groupTotal * (1 - ALL_TOOLS_DISCOUNT));
    }

    if (userTools > 0 && totalTools > 0) {
      // Partial tools — proportional discount capped at ALL_TOOLS_DISCOUNT
      const ratio = userTools / totalTools;
      const discount = Math.min(ratio * ALL_TOOLS_DISCOUNT, ALL_TOOLS_DISCOUNT);
      return total + Math.round(groupTotal * (1 - discount));
    }

    return total + groupTotal;
  }, 0);
}
