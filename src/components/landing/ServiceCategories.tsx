import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceCategories = () => {
  const { t } = useLanguage();
  return (
    <section id="categories" className="py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary mb-3 tracking-wider uppercase"
          >
            What we offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight"
          >
            {t("categories.title1")} <span className="text-gradient-warm">{t("categories.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-md mx-auto text-lg"
          >
            {t("categories.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
            >
              <Link
                to={`/book?category=${encodeURIComponent(cat.label)}`}
                className="group relative flex flex-col bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.services.slice(0, 3).map(s => (
                      <span key={s.name} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {s.name}
                      </span>
                    ))}
                    {cat.services.length > 3 && (
                      <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        +{cat.services.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                    Book now <ArrowRight className="w-4 h-4 ml-1" />
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
