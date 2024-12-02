import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { content, inputConfig } from "./config";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SignupsSectionProps {
  signups: number;
  onSignupsChange: (value: number[]) => void;
}

export const SignupsSection = ({ signups, onSignupsChange }: SignupsSectionProps) => {
  const { toast } = useToast();

  const handleSignupsChange = (value: number[]) => {
    let adjustedValue = value[0];
    
    for (const rule of inputConfig.signups.roundingRules) {
      if (adjustedValue <= rule.threshold) {
        adjustedValue = Math.round(adjustedValue / rule.step) * rule.step;
        break;
      }
    }

    toast({
      title: content.signups.toastTitle,
      description: content.signups.toastDescription(adjustedValue),
    });

    onSignupsChange([adjustedValue]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-lg font-medium">
          {content.signups.label}
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{content.signups.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
  );
};