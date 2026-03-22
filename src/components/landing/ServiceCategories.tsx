import { motion } from "framer-motion";
import { Home, Wrench, Scissors, PartyPopper, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Home,
    title: "Home Services",
    description: "Cleaning, cooking, laundry & wardrobe management",
    services: ["Deep Cleaning", "Cooking", "Laundry", "Wardrobe Organization"],
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Wrench,
    title: "Technical Services",
    description: "Plumbing, repairs, electrical & appliance servicing",
    services: ["Plumbing", "Electrical", "Appliance Repair", "AC Service"],
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Scissors,
    title: "Personal Services",
    description: "Haircuts, treatments, nail art & grooming",
    services: ["Haircut", "Hair Treatment", "Nail Art", "Grooming"],
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: PartyPopper,
    title: "Decoration Services",
    description: "Birthday, party, surprise & candlelight dinner décor",
    services: ["Birthday Décor", "Party Setup", "Surprise Décor", "Dinner Décor"],
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Sparkles,
    title: "Other / Custom",
    description: "Request any custom service you need",
    services: ["Custom Request", "Special Event", "Consultation", "More"],
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

const ServiceCategories = () => {
  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Browse by <span className="text-gradient-warm">Category</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose from our wide range of professional services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/book?category=${encodeURIComponent(cat.title)}`}
                className="block group bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.services.map(s => (
                    <span key={s} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
