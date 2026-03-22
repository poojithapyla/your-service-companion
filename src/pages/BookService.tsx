import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Upload, Plus, Trash2, MapPin, Clock, Zap, Calendar } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const categories = [
  { id: "home", label: "Home Services", services: ["Deep Cleaning", "Cooking", "Laundry", "Wardrobe Organization"] },
  { id: "technical", label: "Technical Services", services: ["Plumbing", "Electrical", "Appliance Repair", "AC Service"] },
  { id: "personal", label: "Personal Services", services: ["Haircut", "Hair Treatment", "Nail Art", "Grooming"] },
  { id: "decoration", label: "Decoration Services", services: ["Birthday Décor", "Party Setup", "Surprise Décor", "Dinner Décor"] },
  { id: "other", label: "Other / Custom", services: ["Custom Request"] },
];

const scheduleOptions = [
  { id: "instant", label: "Instant", desc: "ASAP", icon: Zap },
  { id: "one-day", label: "One Day", desc: "Pick a date", icon: Calendar },
  { id: "daily", label: "Daily", desc: "Recurring daily", icon: Clock },
  { id: "weekly", label: "Weekly", desc: "Once a week", icon: Calendar },
  { id: "monthly", label: "Monthly", desc: "Once a month", icon: Calendar },
];

interface ServiceItem {
  id: number;
  category: string;
  service: string;
  customService?: string;
}

const STEPS = ["Category & Service", "Details & Photos", "Schedule", "For Whom", "Review"];

const BookService = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 1, category: searchParams.get("category") || "", service: "" },
  ]);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [toolsBy, setToolsBy] = useState<"user" | "provider">("provider");
  const [scheduleType, setScheduleType] = useState("instant");
  const [scheduleDate, setScheduleDate] = useState("");
  const [bookFor, setBookFor] = useState<"self" | "other">("self");
  const [otherDetails, setOtherDetails] = useState({ name: "", phone: "", address: "" });
  const [notes, setNotes] = useState("");

  const activeService = services[activeServiceIdx];
  const selectedCategory = categories.find(c => c.label === activeService?.category);

  const updateService = (field: keyof ServiceItem, value: string) => {
    setServices(prev => prev.map((s, i) => i === activeServiceIdx ? { ...s, [field]: value } : s));
  };

  const addService = () => {
    setServices(prev => [...prev, { id: Date.now(), category: "", service: "" }]);
    setActiveServiceIdx(services.length);
  };

  const removeService = (idx: number) => {
    if (services.length <= 1) return;
    setServices(prev => prev.filter((_, i) => i !== idx));
    setActiveServiceIdx(Math.max(0, activeServiceIdx - 1));
  };

  const canProceed = () => {
    if (step === 0) return services.every(s => s.category && s.service);
    if (step === 2 && scheduleType !== "instant") return !!scheduleDate;
    if (step === 3 && bookFor === "other") return otherDetails.name && otherDetails.phone && otherDetails.address;
    return true;
  };

  const estimatedCost = services.length * 499;

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-display text-lg font-bold text-foreground">Book a Service</span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">{label}</span>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft"
            >
              {/* Step 0: Category & Service */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Select Services</h2>

                  {/* Service tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {services.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveServiceIdx(i)}
                        className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          i === activeServiceIdx ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        Service {i + 1}
                        {services.length > 1 && (
                          <Trash2 className="w-3 h-3 hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeService(i); }} />
                        )}
                      </button>
                    ))}
                    <button onClick={addService} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <select
                      value={activeService?.category || ""}
                      onChange={(e) => { updateService("category", e.target.value); updateService("service", ""); }}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>

                  {selectedCategory && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Service</label>
                      <select
                        value={activeService?.service || ""}
                        onChange={(e) => updateService("service", e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
                      >
                        <option value="">Select a service</option>
                        {selectedCategory.services.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="Other">Other (specify below)</option>
                      </select>
                    </div>
                  )}

                  {activeService?.service === "Other" && (
                    <Input
                      placeholder="Describe the service you need..."
                      value={activeService?.customService || ""}
                      onChange={(e) => updateService("customService", e.target.value)}
                    />
                  )}
                </div>
              )}

              {/* Step 1: Details & Photos */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Details & Photos</h2>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Upload Photos (optional)</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click or drag to upload photos</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Who provides the tools?</label>
                    <div className="flex gap-3">
                      {(["provider", "user"] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setToolsBy(opt)}
                          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
                            toolsBy === opt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                          }`}
                        >
                          {opt === "provider" ? "Service Provider" : "I'll provide"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Additional Notes</label>
                    <Textarea
                      placeholder="Any special instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Choose Timing</h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {scheduleOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setScheduleType(opt.id)}
                        className={`py-4 px-3 rounded-xl border text-center transition-all ${
                          scheduleType === opt.id ? "border-primary bg-primary/10 shadow-soft" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <opt.icon className={`w-5 h-5 mx-auto mb-2 ${scheduleType === opt.id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  {scheduleType !== "instant" && (
                    <Input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  )}
                </div>
              )}

              {/* Step 3: For Whom */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Who Is This For?</h2>

                  <div className="flex gap-3">
                    {(["self", "other"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setBookFor(opt)}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${
                          bookFor === opt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                        }`}
                      >
                        {opt === "self" ? "Myself" : "Someone Else"}
                      </button>
                    ))}
                  </div>

                  {bookFor === "other" && (
                    <div className="space-y-3">
                      <Input placeholder="Full Name" value={otherDetails.name} onChange={e => setOtherDetails(p => ({ ...p, name: e.target.value }))} />
                      <Input placeholder="Phone Number" value={otherDetails.phone} onChange={e => setOtherDetails(p => ({ ...p, phone: e.target.value }))} />
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Address" className="pl-9" value={otherDetails.address} onChange={e => setOtherDetails(p => ({ ...p, address: e.target.value }))} />
                      </div>
                    </div>
                  )}

                  {bookFor === "self" && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Your Address" className="pl-9" />
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Review & Confirm</h2>

                  <div className="space-y-3">
                    {services.map((s, i) => (
                      <div key={s.id} className="bg-muted/50 rounded-xl p-4">
                        <div className="text-sm font-semibold text-foreground">{s.category}</div>
                        <div className="text-sm text-muted-foreground">{s.service === "Other" ? s.customService : s.service}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium text-foreground capitalize">{scheduleType}{scheduleDate ? ` — ${new Date(scheduleDate).toLocaleDateString()}` : ""}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tools by</span>
                    <span className="font-medium text-foreground capitalize">{toolsBy}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Booking for</span>
                    <span className="font-medium text-foreground capitalize">{bookFor === "self" ? "Myself" : otherDetails.name}</span>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-foreground">Estimated Cost</span>
                      <span className="text-2xl font-bold text-gradient-warm">₹{estimatedCost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Final cost may vary. Pay via COD, Card, UPI, or Online.</p>
                  </div>

                  <Button variant="hero" size="lg" className="w-full py-6 text-base">
                    Confirm Booking
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button variant="hero" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookService;
