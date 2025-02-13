import { useTranslation } from "react-i18next";

export const formatDate = (isoString: string | null, locale?: string) => {
    if(!isoString) return ''
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(locale || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Хук для использования с `i18next`
export const useFormattedDate = (isoString: string | null) => {
  const { i18n } = useTranslation();
  return formatDate(isoString, i18n.language);
};
