import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const { user, userRole } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden pt-16">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="text-sm font-medium text-primary">{t("hero.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6"
          >
            {t("hero.title1")}{" "}
            <span className="text-gradient-warm">{t("hero.title2")}</span>{" "}
            {t("hero.title3")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-body"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Show "Book a Service" only if NOT a partner */}
            {(!user || userRole !== "partner") && (
              <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
                <Link to={user ? "/book" : "/auth?mode=signup&role=customer"}>
                  {t("hero.book")} <ArrowRight className="ml-1 w-5 h-5" />
                </Link>
              </Button>
            )}
            {/* Show "Become a Partner" only if NOT logged in as customer or partner */}
            {!user && (
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6" asChild>
                <Link to="/auth?mode=signup&role=partner">
                  {t("hero.partner")}
                </Link>
              </Button>
            )}
            {/* Logged-in user: go to dashboard */}
            {user && (
              <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
                <Link to={userRole === "partner" ? "/partner" : userRole === "admin" ? "/admin" : "/dashboard"}>
                  Go to Dashboard <ArrowRight className="ml-1 w-5 h-5" />
                </Link>
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span>✨ Home Services</span>
            <div className="h-4 w-px bg-border" />
            <span>🔧 Repairs & Installations</span>
            <div className="h-4 w-px bg-border" />
            <span>💇 Beauty & Grooming</span>
            <div className="h-4 w-px bg-border" />
            <span>🎉 Décor</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
