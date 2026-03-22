import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const currentLang = languages.find(l => l.code === selectedLang);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SB</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">ServiBook</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang?.label}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-elevated py-1 min-w-[140px]">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedLang === lang.code ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Log In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#categories" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Categories</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>How It Works</a>
          
          {/* Mobile language selector */}
          <div className="flex flex-wrap gap-2 py-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  selectedLang === lang.code ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button variant="hero" size="sm" className="flex-1" asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
