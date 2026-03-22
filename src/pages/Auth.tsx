import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { categories } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const roles = [
  { id: "customer", label: "Customer", desc: "Book services for yourself or others" },
  { id: "partner", label: "Service Partner", desc: "Offer your services and earn" },
];

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "customer");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirect = searchParams.get("redirect");
      navigate(redirect ? `/${redirect}` : "/dashboard");
    }
  }, [user, navigate, searchParams]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setShowCategoryError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && selectedRole === "partner" && selectedCategories.length === 0) {
      setShowCategoryError(true);
      return;
    }
    setIsLoading(true);
    try {
      if (isSignup) {
        const credentials = authMethod === "email"
          ? { email, password, options: { data: { full_name: fullName, role: selectedRole, partner_categories: selectedCategories } } }
          : { phone, password, options: { data: { full_name: fullName, role: selectedRole, partner_categories: selectedCategories } } };
        const { error } = await supabase.auth.signUp(credentials);
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      } else {
        const credentials = authMethod === "email"
          ? { email, password }
          : { phone, password };
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `${provider} login failed`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-elevated">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SB</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">ServiBook</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isSignup ? "Join ServiBook to get started" : "Log in to your account"}
          </p>

          {/* Role Selection (signup only) */}
          {isSignup && (
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => { setSelectedRole(role.id); setShowCategoryError(false); }}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      selectedRole === role.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div className={`text-xs font-semibold ${selectedRole === role.id ? "text-primary" : "text-foreground"}`}>{role.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{role.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Partner category selection */}
          {isSignup && selectedRole === "partner" && (
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Service categories you provide <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                      selectedCategories.includes(cat.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selectedCategories.includes(cat.id) ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {selectedCategories.includes(cat.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
              {showCategoryError && (
                <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please select at least one category</span>
                </div>
              )}
            </div>
          )}

          {/* Auth Method Toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            {(["email", "phone"] as const).map(method => (
              <button
                key={method}
                onClick={() => setAuthMethod(method)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  authMethod === method ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {method === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {method === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
            {isSignup && <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />}
            {authMethod === "email" ? (
              <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
            ) : (
              <Input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} required />
            )}
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button variant="hero" className="w-full py-5" type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" type="button" onClick={() => handleSocialLogin("google")}>Google</Button>
              <Button variant="outline" className="w-full" type="button" onClick={() => handleSocialLogin("apple")}>Apple</Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
