import { motion } from "framer-motion";
import { Search, CalendarCheck, CreditCard, Star } from "lucide-react";

const steps = [
  { icon: Search, title: "Choose a Service", desc: "Browse categories or search for what you need" },
  { icon: CalendarCheck, title: "Pick a Time", desc: "Instant booking or schedule for later" },
  { icon: CreditCard, title: "Confirm & Pay", desc: "Pay online, by card, UPI, or cash on delivery" },
  { icon: Star, title: "Get It Done", desc: "A verified professional arrives at your door" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
        >
          How It <span className="text-gradient-warm">Works</span>
        </motion.h2>
        <p className="text-muted-foreground">Four simple steps to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
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

export default HowItWorks;
