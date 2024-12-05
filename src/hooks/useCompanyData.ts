import { useState, useEffect } from "react";
import { extractDominantColor } from "@/utils/colorExtractor";

interface CompanyData {
  isLoading: boolean;
  accentColor: string;
  savedDomain: string;
  domain: string;
  setDomain: (domain: string) => void;
  setSavedDomain: (domain: string) => void;
}

export const useCompanyData = (initialDomain: string = "chargebee.com"): CompanyData => {
  const [isLoading, setIsLoading] = useState(true);
  const [accentColor, setAccentColor] = useState("");
  const [domain, setDomain] = useState(initialDomain);
  const [savedDomain, setSavedDomain] = useState(initialDomain);

  useEffect(() => {
    if (!savedDomain) return;

    const logoUrl = `https://logo.clearbit.com/${savedDomain}`;
    extractDominantColor(logoUrl)
      .then(color => {
        setAccentColor(color);
        setIsLoading(false);
      })
      .catch(() => {
        setAccentColor("#12ED8A");
        setIsLoading(false);
      });
  }, [savedDomain]);

  return {
    isLoading,
    accentColor,
    savedDomain,
    domain,
    setDomain,
    setSavedDomain
  };
};