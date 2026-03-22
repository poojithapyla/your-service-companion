import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Upload, Plus, Trash2, MapPin, Clock, Zap, Calendar, Search, CheckCircle2, AlertCircle, Navigation, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { categories, PHOTO_REQUIRED_SERVICES, type CategoryDefinition, type ServiceDefinition } from "@/data/services";
import { getToolEmoji } from "@/data/toolIcons";

const scheduleOptions = [
  { id: "instant", label: "Instant", desc: "ASAP", icon: Zap },
  { id: "one-day", label: "One Day", desc: "Pick a date", icon: Calendar },
  { id: "daily", label: "Daily", desc: "Recurring daily", icon: Clock },
  { id: "weekly", label: "Weekly", desc: "Once a week", icon: Calendar },
  { id: "monthly", label: "Monthly", desc: "Once a month", icon: Calendar },
];

interface ServiceItem {
  id: number;
  categoryId: string;
  serviceNames: string[];
  customService?: string;
  toolsWithUser: string[];
  noneOfAboveTools: boolean;
}

const STEPS = ["Category", "Services", "Details & Photos", "Schedule", "For Whom", "Review"];

const SAVED_ADDRESS_KEY = "servibook_saved_address";

const BookService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCat = searchParams.get("category") || "";
  const matchedCat = categories.find(c => c.label === initialCat);

  const [step, setStep] = useState(matchedCat ? 1 : 0);
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 1, categoryId: matchedCat?.id || "", serviceNames: [], toolsWithUser: [], noneOfAboveTools: false },
  ]);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [serviceSearch, setServiceSearch] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState("instant");
  const [scheduleDate, setScheduleDate] = useState("");
  const [bookFor, setBookFor] = useState<"self" | "other" | "">("");
  const [selfAddress, setSelfAddress] = useState("");
  const [otherDetails, setOtherDetails] = useState({ name: "", phone: "", address: "" });
  const [notes, setNotes] = useState("");
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [locatingGPS, setLocatingGPS] = useState(false);

  // Load saved address
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
    if (saved) setSelfAddress(saved);
  }, []);

  // Save address when changed
  const updateSelfAddress = (addr: string) => {
    setSelfAddress(addr);
    if (addr.trim()) localStorage.setItem(SAVED_ADDRESS_KEY, addr);
  };

  const activeService = services[activeServiceIdx];
  const selectedCategory = categories.find(c => c.id === activeService?.categoryId);

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return [];
    const q = serviceSearch.toLowerCase();
    return selectedCategory.services.filter(s => s.name.toLowerCase().includes(q));
  }, [selectedCategory, serviceSearch]);

  const updateService = (field: keyof ServiceItem, value: any) => {
    setServices(prev => prev.map((s, i) => i === activeServiceIdx ? { ...s, [field]: value } : s));
  };

  const selectCategory = (catId: string) => {
    updateService("categoryId", catId);
    updateService("serviceNames", []);
    updateService("customService", "");
    updateService("toolsWithUser", []);
    updateService("noneOfAboveTools", false);
    setServiceSearch("");
    setStep(1);
  };

  const toggleService = (name: string) => {
    const current = activeService?.serviceNames || [];
    if (current.includes(name)) {
      updateService("serviceNames", current.filter((n: string) => n !== name));
    } else {
      updateService("serviceNames", [...current, name]);
    }
  };

  const toggleToolWithUser = (tool: string, svcIdx: number) => {
    setServices(prev => prev.map((s, i) => {
      if (i !== svcIdx) return s;
      return {
        ...s,
        noneOfAboveTools: false,
        toolsWithUser: s.toolsWithUser.includes(tool) ? s.toolsWithUser.filter(t => t !== tool) : [...s.toolsWithUser, tool],
      };
    }));
  };

  const toggleNoneOfAbove = (svcIdx: number) => {
    setServices(prev => prev.map((s, i) => {
      if (i !== svcIdx) return s;
      return { ...s, noneOfAboveTools: !s.noneOfAboveTools, toolsWithUser: [] };
    }));
  };

  const addServiceGroup = () => {
    setServices(prev => [...prev, { id: Date.now(), categoryId: "", serviceNames: [], toolsWithUser: [], noneOfAboveTools: false }]);
    setActiveServiceIdx(services.length);
    setStep(0);
  };

  const removeServiceGroup = (idx: number) => {
    if (services.length <= 1) return;
    setServices(prev => prev.filter((_, i) => i !== idx));
    setActiveServiceIdx(Math.max(0, activeServiceIdx - 1));
  };

  const isOtherService = (name: string) => name === "Other (specify below)" || name === "Custom Request";
  const hasOtherSelected = activeService?.serviceNames.some((n: string) => isOtherService(n));

  const selectedServiceDefs = useMemo(() => {
    return services.flatMap(s => {
      const cat = categories.find(c => c.id === s.categoryId);
      if (!cat) return [];
      return s.serviceNames.map(name => cat.services.find(sv => sv.name === name)).filter(Boolean) as ServiceDefinition[];
    });
  }, [services]);

  const photoRequiredServices = selectedServiceDefs.filter(s => s.photoRequired);
  const needsMandatoryPhotos = photoRequiredServices.length > 0;

  const notesPlaceholders = useMemo(() => {
    return selectedServiceDefs
      .filter(s => s.notesPlaceholder)
      .map(s => s.notesPlaceholder!);
  }, [selectedServiceDefs]);

  // Check if all services with tools have either selected some tools or "none of above"
  const allToolsHandled = useMemo(() => {
    return services.every(s => {
      const cat = categories.find(c => c.id === s.categoryId);
      if (!cat) return true;
      return s.serviceNames.every(name => {
        const svcDef = cat.services.find(sv => sv.name === name);
        if (!svcDef || svcDef.tools.length === 0) return true;
        return s.toolsWithUser.length > 0 || s.noneOfAboveTools;
      });
    });
  }, [services]);

  const canProceed = () => {
    if (step === 0) return !!activeService?.categoryId;
    if (step === 1) {
      return services.every(s => {
        if (s.serviceNames.length === 0) return false;
        if (s.serviceNames.some((n: string) => isOtherService(n)) && (!s.customService || s.customService.trim() === "")) return false;
        return true;
      });
    }
    if (step === 2) {
      if (needsMandatoryPhotos && photos.length === 0) return false;
      if (!allToolsHandled) return false;
      return true;
    }
    if (step === 3 && scheduleType !== "instant") return !!scheduleDate;
    if (step === 4) {
      if (!bookFor) return false;
      if (bookFor === "self") return !!selfAddress.trim();
      if (bookFor === "other") return !!(otherDetails.name && otherDetails.phone && otherDetails.address);
    }
    return true;
  };

  const estimatedCost = services.reduce((sum, s) => sum + s.serviceNames.length * 499, 0);

  const allToolsForReview = services.flatMap(s => {
    const cat = categories.find(c => c.id === s.categoryId);
    if (!cat) return [];
    if (s.noneOfAboveTools) {
      return s.serviceNames.flatMap(name => {
        const svc = cat.services.find(sv => sv.name === name);
        if (!svc) return [];
        return svc.tools.map(t => ({ tool: t, providedByUser: false, service: name }));
      });
    }
    return s.serviceNames.flatMap(name => {
      const svc = cat.services.find(sv => sv.name === name);
      if (!svc) return [];
      return svc.tools.map(t => ({
        tool: t,
        providedByUser: s.toolsWithUser.includes(t),
        service: name,
      }));
    });
  });

  const handleConfirmBooking = () => {
    // Prompt login (mock - in production, check auth state)
    setLoginPrompt(true);
  };

  const proceedToPayment = () => {
    navigate("/payment", {
      state: {
        estimatedCost,
        services: services.map(s => ({
          category: categories.find(c => c.id === s.categoryId)?.label,
          services: s.serviceNames,
          customService: s.customService,
        })),
        scheduleType,
        scheduleDate,
        bookFor,
        address: bookFor === "self" ? selfAddress : otherDetails.address,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Login prompt modal */}
      {loginPrompt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-8 max-w-sm w-full shadow-elevated text-center"
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Login Required</h3>
            <p className="text-sm text-muted-foreground mb-6">Please log in or sign up to complete your booking.</p>
            <div className="space-y-3">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/auth?redirect=payment">Log In / Sign Up</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => {
                setLoginPrompt(false);
                proceedToPayment();
              }}>
                Continue as Guest
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-display text-lg font-bold text-foreground">Book a Service</span>
        </div>
      </div>

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
              {/* Step 0: Category */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Choose Category</h2>
                  {services.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {services.map((s, i) => (
                        <button
                          key={s.id}
                          onClick={() => { setActiveServiceIdx(i); setServiceSearch(""); }}
                          className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            i === activeServiceIdx ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                          }`}
                        >
                          Group {i + 1}
                          {services.length > 1 && (
                            <Trash2 className="w-3 h-3 hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeServiceGroup(i); }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                          activeService?.categoryId === cat.id
                            ? "border-primary bg-primary/10 shadow-soft"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{cat.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
                        </div>
                        {activeService?.categoryId === cat.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Services */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-foreground">Select Services</h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {activeService?.serviceNames.length || 0} selected
                    </span>
                  </div>
                  {selectedCategory && (
                    <p className="text-sm text-muted-foreground">
                      From <span className="font-medium text-foreground">{selectedCategory.label}</span> — select one or more
                    </p>
                  )}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search services..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} className="pl-9" />
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredServices.map(svc => {
                      const isSelected = activeService?.serviceNames.includes(svc.name);
                      return (
                        <button
                          key={svc.name}
                          onClick={() => toggleService(svc.name)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${
                            isSelected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-primary border-primary" : "border-border"}`}>
                            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <span>{svc.name}</span>
                          {svc.photoRequired && (
                            <span className="ml-auto text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">Photo required</span>
                          )}
                        </button>
                      );
                    })}
                    {filteredServices.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4 text-center">No services found</p>
                    )}
                  </div>
                  {hasOtherSelected && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Describe the service you need <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        placeholder="Please describe what service you need in detail..."
                        value={activeService?.customService || ""}
                        onChange={(e) => updateService("customService", e.target.value)}
                        rows={3}
                        required
                      />
                      {(!activeService?.customService || activeService.customService.trim() === "") && (
                        <p className="text-xs text-destructive mt-1">This field is required</p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={addServiceGroup}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add services from another category
                  </button>
                </div>
              )}

              {/* Step 2: Details & Photos + Tools */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Details & Photos</h2>

                  {/* Photo upload */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Upload Photos {needsMandatoryPhotos ? <span className="text-destructive">* Required</span> : "(optional)"}
                    </label>
                    {needsMandatoryPhotos && (
                      <div className="flex items-start gap-2 mb-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-xs text-destructive">
                          Photos are required for: {photoRequiredServices.map(s => s.name).join(", ")}
                        </p>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click or drag to upload photos</p>
                    </div>
                  </div>

                  {/* Tools section per service */}
                  {services.map((svc, svcIdx) => {
                    const cat = categories.find(c => c.id === svc.categoryId);
                    if (!cat) return null;
                    return svc.serviceNames.map(serviceName => {
                      const svcDef = cat.services.find(s => s.name === serviceName);
                      if (!svcDef || svcDef.tools.length === 0) return null;
                      return (
                        <div key={`${svc.id}-${serviceName}`} className="space-y-3">
                          <label className="text-sm font-medium text-foreground block">
                            Tools for: <span className="text-primary">{serviceName}</span> <span className="text-destructive">*</span>
                          </label>
                          <p className="text-xs text-muted-foreground">Select tools you already have. Unselected tools will be brought by the service partner.</p>
                          <div className="grid grid-cols-2 gap-2">
                            {svcDef.tools.map(tool => {
                              const isWithUser = svc.toolsWithUser.includes(tool);
                              const emoji = getToolEmoji(tool);
                              return (
                                <button
                                  key={tool}
                                  onClick={() => toggleToolWithUser(tool, svcIdx)}
                                  disabled={svc.noneOfAboveTools}
                                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                                    svc.noneOfAboveTools
                                      ? "border-border text-muted-foreground/50 cursor-not-allowed"
                                      : isWithUser
                                        ? "border-accent bg-accent/10 text-accent"
                                        : "border-border text-muted-foreground"
                                  }`}
                                >
                                  <span className="text-base shrink-0">{emoji}</span>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isWithUser && !svc.noneOfAboveTools ? "bg-accent border-accent" : "border-border"
                                  }`}>
                                    {isWithUser && !svc.noneOfAboveTools && <Check className="w-3 h-3 text-accent-foreground" />}
                                  </div>
                                  <span className="flex-1">{tool}</span>
                                  {!isWithUser && !svc.noneOfAboveTools && <span className="text-[10px] text-muted-foreground">Partner brings</span>}
                                </button>
                              );
                            })}
                          </div>
                          {/* None of the above */}
                          <button
                            onClick={() => toggleNoneOfAbove(svcIdx)}
                            className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                              svc.noneOfAboveTools
                                ? "border-primary bg-primary/10 text-primary font-medium"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              svc.noneOfAboveTools ? "bg-primary border-primary" : "border-border"
                            }`}>
                              {svc.noneOfAboveTools && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <span>None of the above — Service partner brings everything</span>
                          </button>
                          {!svc.noneOfAboveTools && svc.toolsWithUser.length === 0 && (
                            <p className="text-xs text-destructive">Please select tools you have or choose "None of the above"</p>
                          )}
                        </div>
                      );
                    });
                  })}

                  {/* Additional notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Additional Notes</label>
                    {notesPlaceholders.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {notesPlaceholders.map((ph, i) => (
                          <p key={i} className="text-xs text-muted-foreground italic">💡 {ph}</p>
                        ))}
                      </div>
                    )}
                    <Textarea
                      placeholder={notesPlaceholders.length > 0 ? notesPlaceholders[0] : "Any special instructions..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {step === 3 && (
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
                    <Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  )}
                </div>
              )}

              {/* Step 4: For Whom */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Who Is This For? <span className="text-destructive">*</span></h2>
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
                  {!bookFor && (
                    <p className="text-xs text-destructive">Please select who this booking is for</p>
                  )}
                  {bookFor === "other" && (
                    <div className="space-y-3">
                      <Input placeholder="Full Name *" value={otherDetails.name} onChange={e => setOtherDetails(p => ({ ...p, name: e.target.value }))} />
                      <Input placeholder="Phone Number *" value={otherDetails.phone} onChange={e => setOtherDetails(p => ({ ...p, phone: e.target.value }))} />
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Address *" className="pl-9" value={otherDetails.address} onChange={e => setOtherDetails(p => ({ ...p, address: e.target.value }))} />
                      </div>
                    </div>
                  )}
                  {bookFor === "self" && (
                    <div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Your Address *"
                          className="pl-9"
                          value={selfAddress}
                          onChange={e => updateSelfAddress(e.target.value)}
                        />
                      </div>
                      {selfAddress && (
                        <p className="text-xs text-muted-foreground mt-1">📍 Address saved for future bookings</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">Review & Confirm</h2>
                  <div className="space-y-3">
                    {services.map((s) => {
                      const cat = categories.find(c => c.id === s.categoryId);
                      return (
                        <div key={s.id} className="bg-muted/50 rounded-xl p-4">
                          <div className="text-sm font-semibold text-foreground">{cat?.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {s.serviceNames.map(n => isOtherService(n) ? s.customService : n).join(", ")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {allToolsForReview.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Tools Summary</h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allToolsForReview.map((t, i) => (
                          <div key={i} className={`text-xs px-2 py-1.5 rounded-md ${t.providedByUser ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                            {t.tool} — {t.providedByUser ? "You" : "Partner"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium text-foreground capitalize">{scheduleType}{scheduleDate ? ` — ${new Date(scheduleDate).toLocaleDateString()}` : ""}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Booking for</span>
                    <span className="font-medium text-foreground capitalize">{bookFor === "self" ? "Myself" : otherDetails.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-foreground">{bookFor === "self" ? selfAddress : otherDetails.address}</span>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-foreground">Estimated Cost</span>
                      <span className="text-2xl font-bold text-gradient-warm">₹{estimatedCost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Final cost may vary. Pay via COD, Card, UPI, or Online.</p>
                  </div>

                  <Button variant="hero" size="lg" className="w-full py-6 text-base" onClick={handleConfirmBooking}>
                    Proceed to Payment
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 5 && (
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
