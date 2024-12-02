import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { content, inputConfig } from "./config";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CloseRateSectionProps {
  closeRate: string;
  onCloseRateChange: (value: string) => void;
}

export const CloseRateSection = ({ closeRate, onCloseRateChange }: CloseRateSectionProps) => {
  const { toast } = useToast();

  const handleCloseRateChange = (value: string) => {
    toast({
      title: content.closeRate.toastTitle,
      description: content.closeRate.toastDescription(value),
    });
    onCloseRateChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-lg font-medium">
          {content.closeRate.label}
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{content.closeRate.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={closeRate}
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
  );
};