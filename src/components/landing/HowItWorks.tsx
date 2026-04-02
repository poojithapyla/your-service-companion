import { motion } from "framer-motion";
import { Search, CalendarCheck, CreditCard, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stepIcons = [Search, CalendarCheck, CreditCard, Star];

const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = [
    { icon: stepIcons[0], title: t("how.step1"), desc: t("how.step1d") },
    { icon: stepIcons[1], title: t("how.step2"), desc: t("how.step2d") },
    { icon: stepIcons[2], title: t("how.step3"), desc: t("how.step3d") },
    { icon: stepIcons[3], title: t("how.step4"), desc: t("how.step4d") },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-muted/30 relative overflow-hidden">
      {/* Decorative radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.04),transparent_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-bold text-primary mb-3 tracking-widest uppercase"
          >
            Simple process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight"
          >
            {t("how.title1")} <span className="text-gradient-warm">{t("how.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            {t("how.subtitle")}
          </motion.p>
        </div>

        {/* Connecting line */}
        <div className="hidden lg:block absolute top-[55%] left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
              className="text-center group relative"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6 shadow-glow"
              >
                <step.icon className="w-9 h-9 text-primary-foreground" />
                <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center shadow-elevated border-2 border-background">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
