import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ROICalculator = () => {
  const [signups, setSignups] = useState(100);
  const [revenuePerSignup, setRevenuePerSignup] = useState(500);
  const [closeRate, setCloseRate] = useState("20");
  const { toast } = useToast();

  const handleSignupsChange = (value: number[]) => {
    setSignups(value[0]);
    toast({
      title: "Updated Signups",
      description: `Monthly signups set to ${value[0]}`,
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
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          ROI Calculator
        </h1>
        
        <Card className="p-8 shadow-lg">
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
                defaultValue={[100]}
                max={1000}
                step={10}
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
              </label>
              <RadioGroup
                defaultValue="20"
                onValueChange={handleCloseRateChange}
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {["20", "30", "40", "50"].map((rate) => (
                  <div key={rate} className="flex items-center space-x-2">
                    <RadioGroupItem value={rate} id={`rate-${rate}`} />
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