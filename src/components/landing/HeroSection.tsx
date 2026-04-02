import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const categoryChips = [
  { emoji: "✨", label: "Home Services" },
  { emoji: "🔧", label: "Repairs & Installations" },
  { emoji: "💇", label: "Beauty & Grooming" },
  { emoji: "🎉", label: "Décor" },
  { emoji: "🚚", label: "Packers & Movers" },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const { user, userRole } = useAuth();

  return (
    <section className="relative min-h-[92vh] flex items-center bg-gradient-hero overflow-hidden pt-16">
      {/* Animated floating orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("hero.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-foreground mb-6 tracking-tight"
          >
            {t("hero.title1")}{" "}
            <span className="text-gradient-warm relative">
              {t("hero.title2")}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-warm rounded-full origin-left"
              />
            </span>{" "}
            {t("hero.title3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-xl mx-auto font-body leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {(!user || userRole !== "partner") && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero" size="lg" className="text-base px-10 py-7 shadow-glow" asChild>
                  <Link to={user ? "/book" : "/auth?mode=signup&role=customer"}>
                    {t("hero.book")} <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            )}
            {!user && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero-outline" size="lg" className="text-base px-10 py-7" asChild>
                  <Link to="/auth?mode=signup&role=partner">
                    {t("hero.partner")}
                  </Link>
                </Button>
              </motion.div>
            )}
            {user && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero-outline" size="lg" className="text-base px-10 py-7" asChild>
                  <Link to={userRole === "partner" ? "/partner" : userRole === "admin" ? "/admin" : "/dashboard"}>
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-3"
          >
            {categoryChips.map((chip, i) => (
              <motion.span
                key={chip.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/60 text-sm text-muted-foreground shadow-sm cursor-default select-none"
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
