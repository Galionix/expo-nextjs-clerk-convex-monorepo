// import i18next from "i18next";
// import { initReactI18next } from "react-i18next";

// // Импортируем JSON-файлы с переводами
// import en from "./locales/en.json";
// import ru from "./locales/ru.json";

// i18next.use(initReactI18next).init({
//   resources: {
//     en: { translation: en },
//     ru: { translation: ru },
//   },
//   lng: "en", // Язык по умолчанию
//   fallbackLng: "en",
//   interpolation: { escapeValue: false }, // React уже экранирует HTML
// });

// export default i18next;

// import i18next from "i18next";
// import { initReactI18next } from "react-i18next";
// import * as Localization from "expo-localization"; // Получаем системный язык

// import en from "./locales/en.json";
// import ru from "./locales/ru.json";

// i18next.use(initReactI18next).init({
//   resources: {
//     en: { translation: en },
//     ru: { translation: ru },
//   },
//   lng: Localization.locale.startsWith("ru") ? "ru" : "en", // Автоматический выбор
//   fallbackLng: "en",
//   interpolation: { escapeValue: false },
// });

// export default i18next;


import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // Получаем язык системы

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uk from "./locales/uk.json"; // Добавляем украинский

// Список поддерживаемых языков
const SUPPORTED_LANGUAGES = ["en", "ru", "uk"];

// Определяем язык системы
const deviceLanguage = Localization.locale.split("-")[0]; // "ru-RU" -> "ru"

// Если язык системы поддерживается, используем его, иначе "en"
const defaultLanguage = SUPPORTED_LANGUAGES.includes(deviceLanguage)
  ? deviceLanguage
  : "en";

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  lng: defaultLanguage, // Устанавливаем язык по умолчанию
  fallbackLng: "en", // Если язык не поддерживается, ставим английский
  interpolation: { escapeValue: false },
});

export default i18next;

