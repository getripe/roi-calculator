export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const calculateToolCost = (signups: number) => {
  if (signups <= 500) return 499;
  if (signups <= 1000) return 999;
  if (signups <= 5000) return 1999;
  return 2999;
};

export const calculateROI = (signups: number, closeRate: string, revenuePerSignup: number) => {
  const yearlyRevenue = signups * 12 * (parseInt(closeRate) / 100) * revenuePerSignup;
  const monthlyToolCost = calculateToolCost(signups);
  return Math.floor((yearlyRevenue / (monthlyToolCost * 12)));
};