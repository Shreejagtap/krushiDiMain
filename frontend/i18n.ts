import en from "@/assets/locales/en.json";
import hi from "@/assets/locales/hi.json";
import mr from "@/assets/locales/mr.json";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  en,
  hi,
  mr,
};
const i18n = new I18n(translations);

i18n.locale = Localization.getLocales()[0].languageCode ?? "en";
i18n.enableFallback = true;

export const setI18nConfig = (langCode: string) => {
  i18n.locale = langCode;
  i18n.enableFallback = true;
};

export const getCurrentLanguage = () => {
  return i18n.locale;
};

export const t = i18n.t.bind(i18n);



export default i18n;
