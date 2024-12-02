import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { content, inputConfig } from "./config";
import { formatCurrency } from "./utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="flex items-center gap-2">
        <label className="text-lg font-medium">
          {content.revenue.label}
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{content.revenue.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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