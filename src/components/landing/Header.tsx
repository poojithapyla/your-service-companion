import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Sun, Moon, Flame, User, ChevronDown, LogOut, Calendar, Settings, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { languages } from "@/i18n/translations";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const themeOptions = [
  { id: "light" as const, label: "Light", icon: Sun },
  { id: "dark" as const, label: "Dark", icon: Moon },
  { id: "warm" as const, label: "Warm", icon: Flame },
] as const;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut, userRole, profile } = useAuth();
  const navigate = useNavigate();
  const currentLang = languages.find(l => l.code === lang);
  const CurrentThemeIcon = themeOptions.find(to => to.id === theme)?.icon || Sun;

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    navigate("/");
  };

  const dashboardPath = userRole === "partner" ? "/partner" : userRole === "admin" ? "/admin" : "/dashboard";

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
          <a href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.categories")}</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Theme selector */}
          <div className="relative">
            <button
              onClick={() => { setThemeOpen(!themeOpen); setLangOpen(false); setProfileOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <CurrentThemeIcon className="w-4 h-4" />
            </button>
            {themeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-elevated py-1 min-w-[120px]">
                  {themeOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setTheme(opt.id); setThemeOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                        theme === opt.id ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <opt.icon className="w-4 h-4" /> {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setThemeOpen(false); setProfileOpen(false); }}
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
                      key={lang.code as string}
                      onClick={() => { setLang(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        lang.code === currentLang?.code ? "text-primary bg-primary/10 font-medium" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); setThemeOpen(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-elevated py-1 min-w-[180px]">
                    <div className="px-3 py-2 border-b border-border">
                      <div className="text-sm font-medium text-foreground">{profile?.full_name || "User"}</div>
                      <div className="text-xs text-muted-foreground capitalize">{userRole === "user" ? "Customer" : userRole}</div>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-foreground hover:bg-muted transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      {userRole === "partner" ? "My Jobs" : userRole === "admin" ? "Admin Panel" : "My Bookings"}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Profile Settings
                    </Link>
                    {userRole === "user" && (
                      <Link
                        to="/book"
                        onClick={() => setProfileOpen(false)}
                        className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Book a Service
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth?mode=signup">{t("nav.getStarted")}</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#categories" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>{t("nav.categories")}</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>{t("nav.howItWorks")}</a>
          
          <div className="flex flex-wrap gap-2 py-2 border-t border-border pt-3">
            {themeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  theme === opt.id ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground"
                }`}
              >
                <opt.icon className="w-3 h-3 inline mr-1" />{opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  lang === l.code ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to={dashboardPath}>{userRole === "partner" ? "My Jobs" : "My Bookings"}</Link>
                </Button>
                <Button variant="hero" size="sm" className="flex-1" onClick={handleSignOut}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <Link to="/auth">{t("nav.login")}</Link>
                </Button>
                <Button variant="hero" size="sm" className="flex-1" asChild>
                  <Link to="/auth?mode=signup">{t("nav.getStarted")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
