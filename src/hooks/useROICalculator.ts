import { useState, useEffect } from "react";
import { inputConfig } from "@/components/roi-calculator/config";

interface ROICalculatorState {
  signups: number;
  revenuePerSignup: number;
  closeRate: string;
  setSignups: (value: number) => void;
  setRevenuePerSignup: (value: number) => void;
  setCloseRate: (value: string) => void;
}

export const useROICalculator = (): ROICalculatorState => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState("30");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qualifiedParam = params.get('qualified');
    const contractParam = params.get('contract');
    const rateParam = params.get('rate');

    if (qualifiedParam) {
      setSignups(Number(qualifiedParam));
    }
    if (contractParam) {
      setRevenuePerSignup(Number(contractParam));
    }
    if (rateParam) {
      setCloseRate(rateParam);
    }
  }, []);

  return {
    signups,
    revenuePerSignup,
    closeRate,
    setSignups,
    setRevenuePerSignup,
    setCloseRate
  };
};