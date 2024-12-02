import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { content, inputConfig } from "./config";
import { formatCurrency } from "./utils";

interface RevenueSectionProps {
  revenuePerSignup: number;
  onRevenueChange: (value: number[]) => void;
}

export const RevenueSection = ({ revenuePerSignup, onRevenueChange }: RevenueSectionProps) => {
  const { toast } = useToast();

  const handleRevenueChange = (value: number[]) => {
    toast({
      title: content.revenue.toastTitle,
      description: content.revenue.toastDescription(formatCurrency(value[0])),
    });
    onRevenueChange(value);
  };

  return (
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
  );
};