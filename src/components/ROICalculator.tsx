import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const ROICalculator = () => {
  const [signups, setSignups] = useState(100);
  const [revenuePerSignup, setRevenuePerSignup] = useState(50);
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
      title: "Updated Revenue Per Signup",
      description: `Revenue per signup set to ${formatCurrency(value[0])}`,
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
    const monthlyRevenue = signups * revenuePerSignup;
    const annualRevenue = monthlyRevenue * 12;
    return annualRevenue;
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

            {/* Revenue Per Signup Slider */}
            <div className="space-y-4">
              <label className="text-lg font-medium">
                Revenue Per Signup
              </label>
              <Slider
                defaultValue={[50]}
                max={500}
                step={5}
                onValueChange={handleRevenueChange}
                className="py-4"
              />
              <div className="text-2xl font-bold text-primary animate-number-scroll">
                {formatCurrency(revenuePerSignup)} per signup
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