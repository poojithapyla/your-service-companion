import { Home, Wrench, Scissors, PartyPopper, Truck } from "lucide-react";

export interface ServiceDefinition {
  name: string;
  tools: string[];
  photoRequired?: boolean;
  notesPlaceholder?: string;
  notesMandatory?: boolean;
  quantityField?: string; // e.g. "How many bathrooms?"
}

export interface CategoryDefinition {
  id: string;
  icon: any;
  label: string;
  description: string;
  color: string;
  services: ServiceDefinition[];
  isPackersMovers?: boolean;
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
      { name: "Bathroom Cleaning", tools: ["Toilet Brush", "Disinfectant", "Scrub Pads", "Gloves", "Bathroom Cleaner"], quantityField: "How many bathrooms?" },
      { name: "Kitchen Cleaning", tools: ["Degreaser", "Scrub Pads", "Steel Cleaner", "Sink Cleaner", "Gloves"] },
      { name: "Kitchen Sink Cleaning", tools: ["Scrub Pads", "Sink Cleaner", "Gloves", "Degreaser"] },
      { name: "Sofa Cleaning", tools: ["Upholstery Cleaner", "Steam Cleaner", "Vacuum", "Brush"], photoRequired: true, notesPlaceholder: "Upload a photo of the sofa for accurate assessment" },
      { name: "Carpet Cleaning", tools: ["Carpet Shampoo", "Steam Cleaner", "Vacuum", "Stain Remover"] },
      { name: "Mopping", tools: ["Mop & Bucket", "Floor Cleaner", "Gloves"] },
      { name: "Cooking", tools: ["Cooking Utensils", "Stove", "Ingredients", "Cutting Board", "Knives"], notesPlaceholder: "Please mention the curry/dish that needs to be cooked", notesMandatory: true },
      { name: "Meal Prep", tools: ["Containers", "Knives", "Cutting Board", "Ingredients"] },
      { name: "Chopping", tools: ["Knives", "Cutting Board", "Containers"] },
      { name: "Laundry", tools: ["Washing Machine", "Detergent", "Fabric Softener", "Iron", "Hangers"] },
      { name: "Ironing", tools: ["Iron", "Ironing Board", "Starch Spray", "Hangers"] },
      { name: "Folding Clothes", tools: ["Hangers", "Storage Bags"] },
      { name: "Arranging Things", tools: ["Storage Boxes", "Labels", "Shelving Units"] },
      { name: "Wardrobe Organization", tools: ["Hangers", "Storage Boxes", "Labels", "Mothballs"] },
      { name: "Home Sanitization", tools: ["Sanitizer Spray", "UV Lamp", "Disinfectant", "PPE Kit", "Fogging Machine"] },
      { name: "Window Cleaning", tools: ["Squeegee", "Glass Cleaner", "Ladder", "Microfiber Cloths"], quantityField: "How many windows?" },
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
    label: "Repairs & Installations",
    description: "Plumbing, electrical, appliance repair & setup",
    color: "bg-amber-500/10 text-amber-600",
    services: [
      { name: "Plumbing - Leak Fix", tools: ["Pipe Wrench", "Plumber's Tape", "Sealant", "Replacement Pipes"] },
      { name: "Plumbing - Tap Installation", tools: ["Wrench", "Plumber's Tape", "New Tap", "Sealant"], quantityField: "How many taps?" },
      { name: "Plumbing - Drain Cleaning", tools: ["Drain Snake", "Plunger", "Drain Cleaner", "Gloves"] },
      { name: "Plumbing - Toilet Repair", tools: ["Flapper Valve", "Wrench", "Sealant", "Float Mechanism"] },
      { name: "Electrical - Wiring", tools: ["Wire Stripper", "Multimeter", "Electrical Tape", "Wires", "Junction Box"] },
      { name: "Electrical - Switch/Socket", tools: ["Screwdriver", "New Switch/Socket", "Tester", "Wire Cutter"], quantityField: "How many switches/sockets?" },
      { name: "Electrical - Fan Installation", tools: ["Drill", "Screwdriver", "Wire Connectors", "Fan Kit"], quantityField: "How many fans?" },
      { name: "Electrical - Light Fixture", tools: ["Drill", "Screwdriver", "Wires", "Light Fixture"], quantityField: "How many light fixtures?" },
      { name: "Appliance Repair - Washing Machine", tools: ["Multimeter", "Screwdriver Set", "Replacement Parts", "Lubricant"] },
      { name: "Appliance Repair - Refrigerator", tools: ["Thermometer", "Multimeter", "Replacement Parts", "Compressor Kit"] },
      { name: "Appliance Repair - Microwave", tools: ["Screwdriver", "Multimeter", "Fuse Kit", "Replacement Parts"] },
      { name: "AC Service - Regular", tools: ["Cleaning Solution", "Pressure Washer", "Filters", "Coil Cleaner"] },
      { name: "AC Service - Gas Refill", tools: ["Refrigerant Gas", "Gauge Set", "Vacuum Pump", "Charging Hose"] },
      { name: "AC Installation", tools: ["Drill", "Mounting Bracket", "Copper Pipe", "Insulation Tape", "AC Unit"] },
      { name: "Inverter/UPS Repair", tools: ["Multimeter", "Soldering Iron", "Battery Tester", "Replacement Parts"] },
      { name: "CCTV Installation", tools: ["Drill", "CCTV Cameras", "Cables", "DVR/NVR", "Monitor"], quantityField: "How many cameras?" },
      { name: "Geyser Repair", tools: ["Wrench", "Thermostat", "Heating Element", "Multimeter"] },
      { name: "Carpentry Work", tools: ["Saw", "Hammer", "Nails", "Screwdriver Set", "Wood Glue", "Sandpaper"] },
      { name: "Painting", tools: ["Paint Brushes", "Rollers", "Paint", "Primer", "Drop Cloth", "Tape"], notesPlaceholder: "Please mention color combinations & area details", notesMandatory: true },
      { name: "Furniture Assembly", tools: ["Screwdriver Set", "Allen Keys", "Hammer", "Level"] },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "personal",
    icon: Scissors,
    label: "Beauty & Grooming",
    description: "Haircuts, styling, nail art, facials & spa",
    color: "bg-pink-500/10 text-pink-600",
    services: [
      { name: "Men's Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape", "Spray Bottle"], photoRequired: true, notesPlaceholder: "Upload a photo of the hairstyle you want" },
      { name: "Women's Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape", "Sectioning Clips"], photoRequired: true, notesPlaceholder: "Upload a photo of the hairstyle you want" },
      { name: "Kids Haircut", tools: ["Scissors", "Clippers", "Comb", "Cape"], photoRequired: true, notesPlaceholder: "Upload a photo of the hairstyle you want" },
      { name: "Hair Coloring", tools: ["Hair Dye", "Brush", "Gloves", "Foil", "Bowl", "Cape"], photoRequired: true, notesPlaceholder: "Upload a photo of the hair color you want" },
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
      { name: "Birthday Décor - Basic", tools: ["Balloons", "Banner", "Ribbons", "Tape", "Streamers"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the décor theme you want" },
      { name: "Birthday Décor - Premium", tools: ["Balloon Arch", "LED Lights", "Backdrops", "Props", "Cake Stand", "Confetti"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the décor theme you want" },
      { name: "Birthday Décor - Kids Theme", tools: ["Theme Balloons", "Character Props", "Banners", "Table Setup", "Party Hats"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the décor theme you want" },
      { name: "Party Setup - House Party", tools: ["Lights", "Balloons", "Music System", "Table Setup", "Streamers"], photoRequired: true, notesPlaceholder: "Upload a reference photo of the party setup you want" },
      { name: "Party Setup - Garden Party", tools: ["Fairy Lights", "Canopies", "Flower Arrangements", "Seating", "Lanterns"], photoRequired: true, notesPlaceholder: "Upload reference photos" },
      { name: "Party Setup - Corporate Event", tools: ["Banners", "Podium", "Seating", "Projector Setup", "Flower Arrangements"], photoRequired: true, notesPlaceholder: "Upload reference photos" },
      { name: "Surprise Décor - Room", tools: ["Rose Petals", "Candles", "Fairy Lights", "Balloons", "Gift Wrapping"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Surprise Décor - Rooftop", tools: ["Fairy Lights", "Canopy", "Cushions", "Candles", "Flowers"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Surprise Décor - Car", tools: ["Ribbons", "Balloons", "Flowers", "Gift Box"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Candlelight Dinner Décor - Indoor", tools: ["Candles", "Table Setting", "Flowers", "Fairy Lights", "Music System"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Candlelight Dinner Décor - Outdoor", tools: ["Canopy", "Candles", "Table Setting", "Fairy Lights", "Flowers", "Lanterns"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Anniversary Décor", tools: ["Balloons", "Flowers", "Photo Frames", "LED Lights", "Cake Stand"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Baby Shower Décor", tools: ["Theme Balloons", "Banners", "Props", "Cake Stand", "Photo Booth"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Housewarming Décor", tools: ["Flowers", "Rangoli", "Torans", "Lights", "Welcome Board"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Festival Décor", tools: ["Lights", "Rangoli", "Flowers", "Diyas", "Torans", "Candles"], photoRequired: true, notesPlaceholder: "Upload a reference photo" },
      { name: "Wedding Décor - Small", tools: ["Flower Arrangements", "Drapes", "Lights", "Stage Setup", "Mandap"], photoRequired: true, notesPlaceholder: "Upload reference photos of the wedding décor theme" },
      { name: "Other (specify below)", tools: [] },
    ],
  },
  {
    id: "packers",
    icon: Truck,
    label: "Packers & Movers",
    description: "Packing, moving & relocation services",
    color: "bg-emerald-500/10 text-emerald-600",
    isPackersMovers: true,
    services: [],
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

// Services that require mandatory additional notes
export const NOTES_MANDATORY_SERVICES = categories
  .flatMap(cat => cat.services)
  .filter(s => s.notesMandatory)
  .map(s => s.name);

// Services that need quantity input
export const QUANTITY_SERVICES = categories
  .flatMap(cat => cat.services)
  .filter(s => s.quantityField)
  .map(s => ({ name: s.name, question: s.quantityField! }));
