import { Home, Wrench, Scissors, PartyPopper, Sparkles } from "lucide-react";

export interface ServiceDefinition {
  name: string;
  tools: string[];
  photoRequired?: boolean;
  notesPlaceholder?: string;
}

export interface CategoryDefinition {
  id: string;
  icon: any;
  label: string;
  description: string;
  color: string;
  services: ServiceDefinition[];
}

export const categories: CategoryDefinition[] = [
  {
    id: "home",
    icon: Home,
    label: "Home Services",
    description: "Cleaning, cooking, laundry & wardrobe management",
    color: "bg-blue-500/10 text-blue-600",
    services: [
      { name: "Deep Cleaning", tools: ["Vacuum Cleaner", "Mop & Bucket", "Cleaning Liquids", "Scrub Brushes", "Microfiber Cloths", "Glass Cleaner"] },
      { name: "Regular Cleaning", tools: ["Broom", "Mop & Bucket", "Dusting Cloth", "Floor Cleaner"] },
      { name: "Bathroom Cleaning", tools: ["Toilet Brush", "Disinfectant", "Scrub Pads", "Gloves", "Bathroom Cleaner"] },
      { name: "Kitchen Cleaning", tools: ["Degreaser", "Scrub Pads", "Steel Cleaner", "Sink Cleaner", "Gloves"] },
      { name: "Kitchen Sink Cleaning", tools: ["Scrub Pads", "Sink Cleaner", "Gloves", "Degreaser"] },
      { name: "Sofa Cleaning", tools: ["Upholstery Cleaner", "Steam Cleaner", "Vacuum", "Brush"] },
      { name: "Carpet Cleaning", tools: ["Carpet Shampoo", "Steam Cleaner", "Vacuum", "Stain Remover"] },
      { name: "Mopping", tools: ["Mop & Bucket", "Floor Cleaner", "Gloves"] },
      { name: "Cooking", tools: ["Cooking Utensils", "Stove", "Ingredients", "Cutting Board", "Knives"], notesPlaceholder: "Please mention the curry/dish that needs to be cooked" },
      { name: "Meal Prep", tools: ["Containers", "Knives", "Cutting Board", "Ingredients"] },
      { name: "Chopping", tools: ["Knives", "Cutting Board", "Containers"] },
      { name: "Laundry", tools: ["Washing Machine", "Detergent", "Fabric Softener", "Iron", "Hangers"] },
      { name: "Ironing", tools: ["Iron", "Ironing Board", "Starch Spray", "Hangers"] },
      { name: "Folding Clothes", tools: ["Hangers", "Storage Bags"] },
      { name: "Arranging Things", tools: ["Storage Boxes", "Labels", "Shelving Units"] },
      { name: "Wardrobe Organization", tools: ["Hangers", "Storage Boxes", "Labels", "Mothballs"] },
      { name: "Home Sanitization", tools: ["Sanitizer Spray", "UV Lamp", "Disinfectant", "PPE Kit", "Fogging Machine"] },
      { name: "Window Cleaning", tools: ["Squeegee", "Glass Cleaner", "Ladder", "Microfiber Cloths"] },
      { name: "Pest Control", tools: ["Pesticide Spray", "Gel Bait", "PPE Kit", "Fogging Machine"] },
      { name: "Water Tank Cleaning", tools: ["Pump", "Cleaning Agent", "Scrub Brush", "Hose"] },
      { name: "Dusting", tools: ["Dusting Cloth", "Feather Duster", "Step Stool"] },
      { name: "Dishwashing", tools: ["Dish Soap", "Scrub Pads", "Gloves", "Drying Rack"] },
      { name: "Balcony Cleaning", tools: ["Broom", "Mop & Bucket", "Glass Cleaner", "Scrub Brush"] },
      { name: "Fridge Cleaning", tools: ["Cleaning Solution", "Microfiber Cloths", "Baking Soda"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "technical",
    icon: Wrench,
    label: "Technical Services",
    description: "Plumbing, repairs, electrical & appliance servicing",
    color: "bg-amber-500/10 text-amber-600",
    services: [
      { name: "Plumbing - Leak Fix", tools: ["Pipe Wrench", "Plumber's Tape", "Sealant", "Replacement Pipes"] },
      { name: "Plumbing - Tap Installation", tools: ["Wrench", "Plumber's Tape", "New Tap", "Sealant"] },
      { name: "Plumbing - Drain Cleaning", tools: ["Drain Snake", "Plunger", "Drain Cleaner", "Gloves"] },
      { name: "Plumbing - Toilet Repair", tools: ["Flapper Valve", "Wrench", "Sealant", "Float Mechanism"] },
      { name: "Electrical - Wiring", tools: ["Wire Stripper", "Multimeter", "Electrical Tape", "Wires", "Junction Box"] },
      { name: "Electrical - Switch/Socket", tools: ["Screwdriver", "New Switch/Socket", "Tester", "Wire Cutter"] },
      { name: "Electrical - Fan Installation", tools: ["Drill", "Screwdriver", "Wire Connectors", "Fan Kit"] },
      { name: "Electrical - Light Fixture", tools: ["Drill", "Screwdriver", "Wires", "Light Fixture"] },
      { name: "Appliance Repair - Washing Machine", tools: ["Multimeter", "Screwdriver Set", "Replacement Parts", "Lubricant"] },
      { name: "Appliance Repair - Refrigerator", tools: ["Thermometer", "Multimeter", "Replacement Parts", "Compressor Kit"] },
      { name: "Appliance Repair - Microwave", tools: ["Screwdriver", "Multimeter", "Fuse Kit", "Replacement Parts"] },
      { name: "AC Service - Regular", tools: ["Cleaning Solution", "Pressure Washer", "Filters", "Coil Cleaner"] },
      { name: "AC Service - Gas Refill", tools: ["Refrigerant Gas", "Gauge Set", "Vacuum Pump", "Charging Hose"] },
      { name: "AC Installation", tools: ["Drill", "Mounting Bracket", "Copper Pipe", "Insulation Tape", "AC Unit"] },
      { name: "Inverter/UPS Repair", tools: ["Multimeter", "Soldering Iron", "Battery Tester", "Replacement Parts"] },
      { name: "CCTV Installation", tools: ["Drill", "CCTV Cameras", "Cables", "DVR/NVR", "Monitor"] },
      { name: "Geyser Repair", tools: ["Wrench", "Thermostat", "Heating Element", "Multimeter"] },
      { name: "Carpentry Work", tools: ["Saw", "Hammer", "Nails", "Screwdriver Set", "Wood Glue", "Sandpaper"] },
      { name: "Painting", tools: ["Paint Brushes", "Rollers", "Paint", "Primer", "Drop Cloth", "Tape"] },
      { name: "Furniture Assembly", tools: ["Screwdriver Set", "Allen Keys", "Hammer", "Level"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "personal",
    icon: Scissors,
    label: "Personal Services",
    description: "Haircuts, treatments, nail art & grooming",
    color: "bg-pink-500/10 text-pink-600",
    services: [
      { name: "Men's Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape", "Spray Bottle"] },
      { name: "Women's Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape", "Sectioning Clips"] },
      { name: "Kids Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape"] },
      { name: "Hair Coloring", tools: ["Hair Dye", "Brush", "Gloves", "Foil", "Bowl", "Cape"] },
      { name: "Hair Straightening", tools: ["Straightener", "Heat Protectant", "Comb", "Clips", "Serum"] },
      { name: "Hair Spa Treatment", tools: ["Hair Mask", "Steamer", "Shampoo", "Conditioner", "Towels"] },
      { name: "Keratin Treatment", tools: ["Keratin Solution", "Flat Iron", "Comb", "Gloves", "Cape"] },
      { name: "Nail Art", tools: ["Nail Polish Set", "Nail Art Brushes", "Dotting Tools", "Base/Top Coat", "UV Lamp"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the nail art design you want" },
      { name: "Manicure", tools: ["Nail File", "Cuticle Pusher", "Hand Cream", "Nail Polish", "Buffer"] },
      { name: "Pedicure", tools: ["Foot Soak", "Pumice Stone", "Nail Clippers", "Foot Cream", "Nail Polish"] },
      { name: "Facial - Basic", tools: ["Cleanser", "Toner", "Face Pack", "Moisturizer", "Steam Machine"] },
      { name: "Facial - Premium", tools: ["Cleanser", "Serum", "Gold/Silver Pack", "Moisturizer", "Roller", "Steam Machine"] },
      { name: "Waxing - Full Body", tools: ["Wax", "Wax Heater", "Strips", "After-Wax Oil", "Talc"] },
      { name: "Waxing - Partial", tools: ["Wax", "Wax Heater", "Strips", "After-Wax Oil"] },
      { name: "Threading", tools: ["Thread", "Scissors", "Soothing Gel"] },
      { name: "Bridal Makeup", tools: ["Makeup Kit", "Brushes", "Foundation", "Setting Spray", "False Lashes"] },
      { name: "Party Makeup", tools: ["Makeup Kit", "Brushes", "Foundation", "Setting Spray"] },
      { name: "Mehendi/Henna", tools: ["Henna Cones", "Design Templates", "Oil", "Cotton"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the mehendi design you want" },
      { name: "Men's Grooming", tools: ["Trimmer", "Shaving Kit", "After-Shave", "Face Wash"] },
      { name: "Massage Therapy", tools: ["Massage Oil", "Towels", "Massage Table", "Hot Stones"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "decoration",
    icon: PartyPopper,
    label: "Décor Services",
    description: "Birthday, party, surprise & candlelight dinner décor",
    color: "bg-purple-500/10 text-purple-600",
    services: [
      { name: "Birthday Décor - Basic", tools: ["Balloons", "Banner", "Ribbons", "Tape", "Streamers"] },
      { name: "Birthday Décor - Premium", tools: ["Balloon Arch", "LED Lights", "Backdrops", "Props", "Cake Stand", "Confetti"] },
      { name: "Birthday Décor - Kids Theme", tools: ["Theme Balloons", "Character Props", "Banners", "Table Setup", "Party Hats"] },
      { name: "Party Setup - House Party", tools: ["Lights", "Balloons", "Music System", "Table Setup", "Streamers"] },
      { name: "Party Setup - Garden Party", tools: ["Fairy Lights", "Canopies", "Flower Arrangements", "Seating", "Lanterns"] },
      { name: "Party Setup - Corporate Event", tools: ["Banners", "Podium", "Seating", "Projector Setup", "Flower Arrangements"] },
      { name: "Surprise Décor - Room", tools: ["Rose Petals", "Candles", "Fairy Lights", "Balloons", "Gift Wrapping"] },
      { name: "Surprise Décor - Rooftop", tools: ["Fairy Lights", "Canopy", "Cushions", "Candles", "Flowers"] },
      { name: "Surprise Décor - Car", tools: ["Ribbons", "Balloons", "Flowers", "Gift Box"] },
      { name: "Candlelight Dinner Décor - Indoor", tools: ["Candles", "Table Setting", "Flowers", "Fairy Lights", "Music System"] },
      { name: "Candlelight Dinner Décor - Outdoor", tools: ["Canopy", "Candles", "Table Setting", "Fairy Lights", "Flowers", "Lanterns"] },
      { name: "Anniversary Décor", tools: ["Balloons", "Flowers", "Photo Frames", "LED Lights", "Cake Stand"] },
      { name: "Baby Shower Décor", tools: ["Theme Balloons", "Banners", "Props", "Cake Stand", "Photo Booth"] },
      { name: "Housewarming Décor", tools: ["Flowers", "Rangoli", "Torans", "Lights", "Welcome Board"] },
      { name: "Festival Décor", tools: ["Lights", "Rangoli", "Flowers", "Diyas", "Torans", "Candles"] },
      { name: "Wedding Décor - Small", tools: ["Flower Arrangements", "Drapes", "Lights", "Stage Setup", "Mandap"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "other",
    icon: Sparkles,
    label: "Other / Custom",
    description: "Request any custom service you need",
    color: "bg-emerald-500/10 text-emerald-600",
    services: [
      { name: "Custom Request", tools: [] },
      { name: "Consultation", tools: [] },
      { name: "Special Event Planning", tools: [] },
      { name: "Errand Service", tools: [] },
      { name: "Pet Care", tools: ["Pet Shampoo", "Brush", "Leash", "Treats", "Towels"] },
      { name: "Gardening", tools: ["Pruning Shears", "Gloves", "Watering Can", "Fertilizer", "Pots"] },
      { name: "Moving Help", tools: ["Boxes", "Tape", "Bubble Wrap", "Dolly", "Straps"] },
      { name: "Grocery Shopping", tools: ["Shopping Bags", "Delivery Vehicle"] },
      { name: "Document Delivery", tools: ["Delivery Vehicle", "ID Proof"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
];

export const getAllServices = () =>
  categories.flatMap(cat =>
    cat.services.map(s => ({ ...s, categoryId: cat.id, categoryLabel: cat.label }))
  );

// Services that require mandatory photo uploads
export const PHOTO_REQUIRED_SERVICES = categories
  .flatMap(cat => cat.services)
  .filter(s => s.photoRequired)
  .map(s => s.name);
