import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, Phone, MapPin, Globe, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { languages } from "@/i18n/translations";

const ProfileSettings = () => {
  const { user, profile, signOut } = useAuth();
  const { lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.saved_address || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      phone,
      saved_address: address,
      preferred_language: lang,
      preferred_theme: theme,
    }).eq("id", user.id);
    if (error) toast.error("Failed to save");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <span className="font-display text-lg font-bold text-foreground">Profile Settings</span>
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
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Saved Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Your default address" className="pl-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" /> Language
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
            <Palette className="w-4 h-4" /> Theme
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
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
