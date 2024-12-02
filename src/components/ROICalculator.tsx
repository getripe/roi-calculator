import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import BackgroundSVG from "./BackgroundSVG";

// Configuration object for all text content
const content = {
  title: "ROI Calculator",
  signups: {
    label: "Average Monthly Signups",
    description: "The number of qualified signups (MQLs / ICP / PQLs etc) that your team wants to get in contact with",
    toastTitle: "Updated Signups",
    toastDescription: (value: number) => `Monthly signups set to ${value}`,
  },
  revenue: {
    label: "Revenue per Closed Deal (Average Contract Value)",
    description: "The average contract value",
    toastTitle: "Updated Revenue per Closed Deal",
    toastDescription: (value: string) => `Revenue per closed deal set to ${value}`,
  },
  closeRate: {
    label: "Sales Close Rate",
    description: "Percentage of sales leads that result in customer conversions",
    toastTitle: "Updated Close Rate",
    toastDescription: (value: string) => `Sales close rate set to ${value}%`,
  },
  results: {
    projectedRevenue: {
      title: "Projected Revenue",
      period: "/ year"
    },
    toolCost: {
      title: "Cost of Tool",
      period: "/ month"
    },
    roi: {
      title: "Yearly ROI",
      suffix: "x"
    }
  }
};

// Configuration for numerical inputs
const inputConfig = {
  signups: {
    default: 500,
    max: 3000,
    step: 1,
    roundingRules: [
      { threshold: 1000, step: 50 },
      { threshold: 3000, step: 100 }
    ]
  },
  revenue: {
    default: 500,
    max: 10000,
    step: 500
  },
  closeRates: ["20", "30", "40", "50"]
};

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateToolCost = (signups: number) => {
  if (signups <= 500) return 499;
  if (signups <= 1000) return 999;
  if (signups <= 5000) return 1999;
  return 2999;
};

const ROICalculator = () => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState(inputConfig.closeRates[0]);
  const { toast } = useToast();

  const handleSignupsChange = (value: number[]) => {
    let adjustedValue = value[0];
    
    for (const rule of inputConfig.signups.roundingRules) {
      if (adjustedValue <= rule.threshold) {
        adjustedValue = Math.round(adjustedValue / rule.step) * rule.step;
        break;
      }
    }

    setSignups(adjustedValue);
    toast({
      title: content.signups.toastTitle,
      description: content.signups.toastDescription(adjustedValue),
    });
  };

  const handleRevenueChange = (value: number[]) => {
    setRevenuePerSignup(value[0]);
    toast({
      title: content.revenue.toastTitle,
      description: content.revenue.toastDescription(formatCurrency(value[0])),
    });
  };

  const handleCloseRateChange = (value: string) => {
    setCloseRate(value);
    toast({
      title: content.closeRate.toastTitle,
      description: content.closeRate.toastDescription(value),
    });
  };

  const calculateROI = () => {
    const yearlyRevenue = signups * 12 * (parseInt(closeRate) / 100) * revenuePerSignup;
    const monthlyToolCost = calculateToolCost(signups);
    const roiMultiplier = (yearlyRevenue / (monthlyToolCost * 12));
    return roiMultiplier.toFixed(1);
  };

  return (
    <div className="relative min-h-screen p-8">
      <BackgroundSVG />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-4xl font-bold text-left">
              {content.title}
            </CardTitle>
          </CardHeader>
          
          <div className="space-y-8">
            {/* Monthly Signups Slider */}
            <div className="space-y-4">
              <label className="text-lg font-medium">
                {content.signups.label}
                <p className="text-sm text-gray-500 font-normal mt-1">
                  {content.signups.description}
                </p>
              </label>
              <Slider
                defaultValue={[inputConfig.signups.default]}
                max={inputConfig.signups.max}
                step={inputConfig.signups.step}
                onValueChange={handleSignupsChange}
                className="py-4"
              />
              <div className="text-2xl font-bold text-primary animate-number-scroll">
                {signups} signups/month
              </div>
            </div>

            {/* Revenue Per Closed Deal Slider */}
            <div className="space-y-4">
              <label className="text-lg font-medium">
                {content.revenue.label}
                <p className="text-sm text-gray-500 font-normal mt-1">
                  {content.revenue.description}
                </p>
              </label>
              <Slider
                defaultValue={[inputConfig.revenue.default]}
                max={inputConfig.revenue.max}
                step={inputConfig.revenue.step}
                onValueChange={handleRevenueChange}
                className="py-4"
              />
              <div className="text-2xl font-bold text-primary animate-number-scroll">
                {formatCurrency(revenuePerSignup)} per closed deal
              </div>
            </div>

            {/* Sales Close Rate Section */}
            <div className="space-y-4">
              <label className="text-lg font-medium">
                {content.closeRate.label}
                <p className="text-sm text-gray-500 font-normal mt-1">
                  {content.closeRate.description}
                </p>
              </label>
              <RadioGroup
                defaultValue={inputConfig.closeRates[0]}
                onValueChange={handleCloseRateChange}
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {inputConfig.closeRates.map((rate) => (
                  <div key={rate} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={rate} 
                      id={`rate-${rate}`}
                      className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-white data-[state=checked]:text-primary relative"
                    >
                      <Check className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 data-[state=checked]:opacity-100 transition-opacity" />
                    </RadioGroupItem>
                    <Label htmlFor={`rate-${rate}`}>{rate}%</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="text-2xl font-bold text-primary">
                {closeRate}% close rate
              </div>
            </div>

            {/* Results Section */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{content.results.projectedRevenue.title}</h3>
                <div className="text-4xl font-bold text-success animate-number-scroll">
                  {formatCurrency(signups * 12 * (parseInt(closeRate) / 100) * revenuePerSignup)}
                  <span className="text-base font-normal text-gray-600 ml-2">
                    {content.results.projectedRevenue.period}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{content.results.toolCost.title}</h3>
                <div className="text-4xl font-bold text-primary animate-number-scroll">
                  {formatCurrency(calculateToolCost(signups))}
                  <span className="text-base font-normal text-gray-600 ml-2">
                    {content.results.toolCost.period}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{content.results.roi.title}</h3>
                <div className="text-4xl font-bold text-primary animate-number-scroll">
                  {calculateROI()}
                  <span className="text-4xl font-bold text-primary ml-2">
                    {content.results.roi.suffix}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;
