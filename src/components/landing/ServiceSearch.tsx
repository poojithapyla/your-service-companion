import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllServices } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceSearch = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  const allServices = useMemo(() => getAllServices(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allServices
      .filter(s => s.name.toLowerCase().includes(q) || s.categoryLabel.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, allServices]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (categoryLabel: string) => {
    navigate(`/book?category=${encodeURIComponent(categoryLabel)}`);
    setQuery("");
    setFocused(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className={`relative flex items-center rounded-2xl border transition-all duration-300 glass ${
        focused ? "border-primary shadow-glow" : "border-border/50 shadow-soft"
      }`}>
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={t("search.placeholder")}
          className="w-full bg-transparent pl-12 pr-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 w-full z-50 bg-card border border-border rounded-xl shadow-elevated overflow-hidden"
          >
            {results.map((svc, i) => (
              <button
                key={`${svc.categoryId}-${svc.name}`}
                onClick={() => handleSelect(svc.categoryLabel)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{svc.name}</div>
                  <div className="text-xs text-muted-foreground">{svc.categoryLabel}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </motion.div>
        )}
        {focused && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 w-full z-50 bg-card border border-border rounded-xl shadow-elevated p-4 text-center text-sm text-muted-foreground"
          >
            {t("search.noResults")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceSearch;
