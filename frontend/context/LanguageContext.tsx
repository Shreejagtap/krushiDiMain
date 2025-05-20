import { getCurrentLanguage, setI18nConfig, t } from "@/i18n";
import React, { createContext, ReactNode, useState } from "react";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: typeof t;
}

export const LanguageContext = createContext<LanguageContextType>(
  {} as LanguageContextType
);

interface Props {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<string>(getCurrentLanguage());

  const changeLanguage = (lang: string) => {
    setI18nConfig(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
