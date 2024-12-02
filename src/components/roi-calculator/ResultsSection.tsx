import { content } from "./config";
import { formatCurrency, calculateToolCost, calculateROI } from "./utils";

interface ResultsSectionProps {
  signups: number;
  closeRate: string;
  revenuePerSignup: number;
}

export const ResultsSection = ({ signups, closeRate, revenuePerSignup }: ResultsSectionProps) => {
  const yearlyRevenue = signups * 12 * (parseInt(closeRate) / 100) * revenuePerSignup;
  const monthlyToolCost = calculateToolCost(signups);
  const roi = calculateROI(signups, closeRate, revenuePerSignup);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{content.results.projectedRevenue.title}</h3>
        <div className="text-4xl font-bold text-success animate-number-scroll">
          {formatCurrency(yearlyRevenue)}
          <span className="text-base font-normal text-gray-600 ml-2">
            {content.results.projectedRevenue.period}
          </span>
        </div>
      </div>

      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{content.results.toolCost.title}</h3>
        <div className="text-4xl font-bold text-primary animate-number-scroll">
          {formatCurrency(monthlyToolCost)}
          <span className="text-base font-normal text-gray-600 ml-2">
            {content.results.toolCost.period}
          </span>
        </div>
      </div>

      <div className="p-6 bg-secondary rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{content.results.roi.title}</h3>
        <div className="text-4xl font-bold text-primary animate-number-scroll">
          {roi}
          <span className="text-4xl font-bold text-primary ml-2">
            {content.results.roi.suffix}
          </span>
        </div>
      </div>
    </div>
  );
};