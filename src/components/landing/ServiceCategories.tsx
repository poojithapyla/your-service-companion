import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceCategories = () => {
  const { t } = useLanguage();
  return (
    <section id="categories" className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] bg-primary/5" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-secondary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-bold text-primary mb-3 tracking-widest uppercase"
          >
            What we offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight"
          >
            {t("categories.title1")} <span className="text-gradient-warm">{t("categories.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-lg mx-auto text-lg"
          >
            {t("categories.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
            >
              <Link
                to={`/book?category=${encodeURIComponent(cat.label)}`}
                className="group relative flex flex-col bg-card rounded-2xl border border-border p-6 h-full transition-all duration-500 hover:-translate-y-3 hover:shadow-elevated overflow-hidden"
              >
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Glow dot */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-5 shadow-soft`}
                  >
                    <cat.icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cat.services.slice(0, 3).map(s => (
                      <span key={s.name} className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                        {s.name}
                      </span>
                    ))}
                    {cat.services.length > 3 && (
                      <span className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                        +{cat.services.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-primary font-semibold translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Book now <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
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
