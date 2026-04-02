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
      {/* Animated floating orbs — uses theme-aware primary/secondary */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-8 w-80 h-80 rounded-full blur-[100px] bg-primary/10"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 left-8 w-[450px] h-[450px] rounded-full blur-[120px] bg-secondary/10"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] bg-accent/5"
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-primary/20 animate-pulse-glow"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t("hero.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] text-foreground mb-7 tracking-tight"
          >
            {t("hero.title1")}{" "}
            <span className="text-gradient-warm relative inline-block">
              {t("hero.title2")}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
                className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-gradient-warm rounded-full origin-left opacity-80"
              />
            </span>{" "}
            {t("hero.title3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-xl mx-auto font-body leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {(!user || userRole !== "partner") && (
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Button variant="hero" size="lg" className="text-base px-10 py-7 shadow-glow relative overflow-hidden group" asChild>
                  <Link to={user ? "/book" : "/auth?mode=signup&role=customer"}>
                    <span className="relative z-10 flex items-center">
                      {t("hero.book")} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            )}
            {!user && (
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Button variant="hero-outline" size="lg" className="text-base px-10 py-7 group" asChild>
                  <Link to="/auth?mode=signup&role=partner">
                    {t("hero.partner")} <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </motion.div>
            )}
            {user && (
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Button variant="hero-outline" size="lg" className="text-base px-10 py-7 group" asChild>
                  <Link to={userRole === "partner" ? "/partner" : userRole === "admin" ? "/admin" : "/dashboard"}>
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-3"
          >
            {categoryChips.map((chip, i) => (
              <motion.span
                key={chip.label}
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.1, y: -4, boxShadow: "var(--shadow-soft)" }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-border/50 text-sm text-foreground/80 shadow-sm cursor-default select-none"
              >
                <span className="text-base">{chip.emoji}</span>
                <span className="font-medium">{chip.label}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
