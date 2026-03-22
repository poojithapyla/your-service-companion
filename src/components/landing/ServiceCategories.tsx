import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/data/services";

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

        <div className="space-y-4 max-w-3xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/book?category=${encodeURIComponent(cat.label)}`}
                className="flex items-center gap-5 group bg-card rounded-2xl border border-border p-5 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.services.slice(0, 4).map(s => (
                      <span key={s.name} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                        {s.name}
                      </span>
                    ))}
                    {cat.services.length > 4 && (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        +{cat.services.length - 4} more
                      </span>
                    )}
                  </div>
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
