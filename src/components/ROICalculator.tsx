import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import BackgroundSVG from "./BackgroundSVG";

const ROICalculator = () => {
  const [signups, setSignups] = useState(1500);  // Default at the middle point
  const [revenuePerSignup, setRevenuePerSignup] = useState(500);
  const [closeRate, setCloseRate] = useState("20");
  const { toast } = useToast();

  const handleSignupsChange = (value: number[]) => {
    let adjustedValue = value[0];
    
    // Adjust the value based on the ranges
    if (adjustedValue <= 1500) {
      adjustedValue = Math.round(adjustedValue / 50) * 50;
    } else if (adjustedValue <= 3000) {
      adjustedValue = Math.round(adjustedValue / 100) * 100;
    } else {
      adjustedValue = Math.round(adjustedValue / 500) * 500;
    }

    setSignups(adjustedValue);
    toast({
      title: "Updated Signups",
      description: `Monthly signups set to ${adjustedValue}`,
    });
  };

  const handleRevenueChange = (value: number[]) => {
    setRevenuePerSignup(value[0]);
    toast({
      title: "Updated Revenue per Closed Deal",
      description: `Revenue per closed deal set to ${formatCurrency(value[0])}`,
    });
  };

  const handleCloseRateChange = (value: string) => {
    setCloseRate(value);
    toast({
      title: "Updated Close Rate",
      description: `Sales close rate set to ${value}%`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateROI = () => {
    const monthlyRevenue = signups * (parseInt(closeRate) / 100) * revenuePerSignup;
    const annualRevenue = monthlyRevenue * 12;
    return annualRevenue * 0.1;  // 10% of the original calculation
  };

  return (
    <div className="relative min-h-screen p-8">
      <BackgroundSVG />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-4" asChild>
              <h1>Calculate Your Potential Revenue</h1>
            </CardTitle>
          </CardHeader>
          
          <div className="space-y-8">
            {/* Monthly Signups Slider */}
            <div className="space-y-4">
              <label className="text-lg font-medium">
                Average Monthly Signups
                <p className="text-sm text-gray-500 font-normal mt-1">
                  The number of qualified signups (MQLs / ICP / PQLs etc) that your team wants to get in contact with
                </p>
              </label>
              <Slider
                defaultValue={[1500]}
                max={5000}
                step={1}
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
                Revenue per Closed Deal (Average Contract Value)
                <p className="text-sm text-gray-500 font-normal mt-1">
                  The average contract value
                </p>
              </label>
              <Slider
                defaultValue={[500]}
                max={10000}
                step={500}
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
                Sales Close Rate
                <p className="text-sm text-gray-500 font-normal mt-1">
                  Percentage of sales leads that result in customer conversions
                </p>
              </label>
              <RadioGroup
                defaultValue="20"
                onValueChange={handleCloseRateChange}
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {["20", "30", "40", "50"].map((rate) => (
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
            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Projected Revenue</h3>
              <div className="text-4xl font-bold text-success animate-number-scroll">
                {formatCurrency(calculateROI())}
                <span className="text-base font-normal text-gray-600 ml-2">
                  / year
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;