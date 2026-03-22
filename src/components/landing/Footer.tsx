import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-foreground text-background/70 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SB</span>
              </div>
              <span className="font-display text-xl font-bold text-background">ServiBook</span>
            </div>
            <p className="text-sm text-background/50">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3 text-sm">{t("services")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/book" className="hover:text-background transition-colors">Home Services</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">Repairs & Installations</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">Beauty & Grooming</Link></li>
              <li><Link to="/book" className="hover:text-background transition-colors">Décor Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 pt-6 flex items-center justify-between text-sm text-background/40">
          <span>© {new Date().getFullYear()} ServiBook. All rights reserved.</span>
          <Link to="/admin" className="text-background/20 hover:text-background/40 transition-colors text-xs">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
