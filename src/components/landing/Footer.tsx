import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-foreground text-background/70 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-4"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SB</span>
              </div>
              <span className="font-display text-xl font-bold text-background">ServiBook</span>
            </motion.div>
            <p className="text-sm text-background/40 leading-relaxed">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm tracking-wide uppercase">{t("services")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/book" className="hover:text-background transition-colors">{t("footer.homeServices")}</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">{t("footer.repairs")}</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">{t("footer.beauty")}</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">{t("footer.decor")}</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">{t("footer.packers")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm tracking-wide uppercase">{t("footer.company")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-background transition-colors">{t("footer.about")}</a></li>
              <li><a href="#" className="hover:text-background transition-colors">{t("footer.careers")}</a></li>
              <li><a href="#" className="hover:text-background transition-colors">{t("footer.contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm tracking-wide uppercase">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-background transition-colors">{t("footer.privacy")}</a></li>
              <li><a href="#" className="hover:text-background transition-colors">{t("footer.terms")}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 pt-6 flex items-center justify-between text-sm text-background/30">
          <span>© {new Date().getFullYear()} ServiBook. {t("footer.rights")}</span>
          <Link to="/admin" className="text-background/15 hover:text-background/30 transition-colors text-xs">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
