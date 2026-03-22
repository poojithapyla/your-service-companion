import { createContext, useContext, useState, ReactNode } from "react";
import type { LangCode } from "@/i18n/translations";
import { t as translate } from "@/i18n/translations";

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem("servibook_lang");
    return (saved as LangCode) || "en";
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("servibook_lang", l);
  };

  const t = (key: string) => translate(key, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};