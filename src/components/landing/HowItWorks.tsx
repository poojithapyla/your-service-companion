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
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            {t("how.title1")} <span className="text-gradient-warm">{t("how.title2")}</span>
          </motion.h2>
          <p className="text-muted-foreground">{t("how.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mb-5 shadow-glow">
                <step.icon className="w-7 h-7 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
