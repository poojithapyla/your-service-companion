import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, Phone, MapPin, Globe, Palette, Check, Languages, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { languages } from "@/i18n/translations";
import { categories } from "@/data/services";
import AddressAutocomplete from "@/components/AddressAutocomplete";

const ProfileSettings = () => {
  const { user, profile, userRole, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [partnerCategories, setPartnerCategories] = useState<string[]>([]);
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const isPartner = userRole === "partner";

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.saved_address || "");
      setPartnerCategories(profile.partner_categories || []);
      setSpokenLanguages((profile as any).spoken_languages || []);
      setIsActive((profile as any).is_active !== false);
    }
  }, [profile]);

  const toggleCategory = (catId: string) => {
    setPartnerCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const toggleSpokenLang = (code: string) => {
    setSpokenLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const updates: any = {
      full_name: fullName,
      phone,
      saved_address: address,
      preferred_language: lang,
      preferred_theme: theme,
    };
    if (isPartner) {
      updates.partner_categories = partnerCategories;
      updates.spoken_languages = spokenLanguages;
      updates.is_active = isActive;
    }
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) toast.error("Failed to save");
    else toast.success(t("profile.save") + " ✓");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <span className="font-display text-lg font-bold text-foreground">{t("profile.title")}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{fullName || "User"}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              {isPartner && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 mt-1 inline-block">
                  Service Partner
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("profile.fullName")}</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("profile.phone")}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("profile.savedAddress")}</label>
              <AddressAutocomplete value={address} onChange={setAddress} placeholder="Your default address" />
            </div>
          </div>
        </div>

        {/* Partner-specific settings */}
        {isPartner && (
          <>
            {/* Availability toggle */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {isActive ? <ToggleRight className="w-5 h-5 text-accent" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                {t("profile.active")}
              </h3>
              <div
                onClick={() => setIsActive(!isActive)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-muted/50 text-muted-foreground"
                }`}
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? "bg-accent" : "bg-muted-foreground/30"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-0.5"}`} />
                </div>
                <span>{isActive ? t("profile.active") : t("profile.inactive")}</span>
              </div>
            </div>

            {/* Service categories */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t("profile.categories")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs text-left transition-all ${
                      partnerCategories.includes(cat.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      partnerCategories.includes(cat.id) ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {partnerCategories.includes(cat.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <cat.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{cat.label}</span>
                  </button>
                ))}
              </div>
              {partnerCategories.length === 0 && (
                <p className="text-xs text-destructive">Select at least one category</p>
              )}
            </div>

            {/* Spoken languages */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Languages className="w-4 h-4" /> {t("profile.spokenLanguages")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => toggleSpokenLang(l.code)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      spokenLanguages.includes(l.code)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {spokenLanguages.includes(l.code) && "✓ "}{l.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* App Language */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" /> {t("profile.language")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  lang === l.code ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4" /> {t("profile.theme")}
          </h3>
          <div className="flex gap-3">
            {(["light", "dark", "warm"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-colors ${
                  theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Button variant="hero" className="w-full py-5" onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? t("profile.saving") : t("profile.save")}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
