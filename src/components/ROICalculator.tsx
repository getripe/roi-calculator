import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackgroundSVG from "./BackgroundSVG";
import { content, inputConfig } from "./roi-calculator/config";
import { SignupsSection } from "./roi-calculator/SignupsSection";
import { RevenueSection } from "./roi-calculator/RevenueSection";
import { CloseRateSection } from "./roi-calculator/CloseRateSection";
import { ResultsSection } from "./roi-calculator/ResultsSection";
import { Share2, SendHorizontal, LinkedinIcon, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ROICalculator = () => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState(inputConfig.closeRates[0]);
  const [domain, setDomain] = useState("chargebee.com");
  const [savedDomain, setSavedDomain] = useState("chargebee.com");
  const { toast } = useToast();

  const handleSaveDomain = () => {
    setSavedDomain(domain);
  };

  const handleShare = async (platform: 'copy' | 'email' | 'linkedin' | 'twitter') => {
    const url = window.location.href;
    const title = "ROI Calculator Results";
    const text = `Check out my ROI calculation results!`;

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The calculator URL has been copied to your clipboard.",
        });
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  return (
    <div className="relative min-h-screen p-8">
      <BackgroundSVG />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="absolute -top-3 right-6 flex">
            <Avatar className="w-16 h-16 border-2 border-white bg-white">
              <AvatarImage 
                src="/lovable-uploads/229ce863-846e-4aa1-af45-90c16c04ddc5.png"
                alt="Logo"
              />
              <AvatarFallback className="bg-primary text-primary-foreground">ST</AvatarFallback>
            </Avatar>
            <Avatar className="w-16 h-16 border-2 border-white -ml-6 bg-white">
              <AvatarImage 
                src={`https://www.google.com/s2/favicons?domain=${savedDomain}&sz=128`}
                alt={`${savedDomain} Logo`}
              />
              <AvatarFallback className="bg-success text-success-foreground">
                {savedDomain.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-4xl font-bold text-left mb-4">
              {content.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="max-w-xs"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveDomain}
              >
                Save
              </Button>
            </div>
          </CardHeader>
          
          <div className="space-y-8">
            <SignupsSection 
              signups={signups} 
              onSignupsChange={(value) => setSignups(value[0])} 
            />
            
            <RevenueSection 
              revenuePerSignup={revenuePerSignup} 
              onRevenueChange={(value) => setRevenuePerSignup(value[0])} 
            />
            
            <CloseRateSection 
              closeRate={closeRate} 
              onCloseRateChange={setCloseRate} 
            />

            <ResultsSection 
              signups={signups}
              closeRate={closeRate}
              revenuePerSignup={revenuePerSignup}
            />

            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare('copy')}
                title="Copy link"
                className="bg-[#008CF1] hover:bg-[#008CF1]/90 border-none text-white"
              >
                <Share2 className="w-4 h-4 stroke-[1.25]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare('email')}
                title="Share via email"
                className="bg-[#008CF1] hover:bg-[#008CF1]/90 border-none text-white"
              >
                <SendHorizontal className="w-4 h-4 stroke-[1.25]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare('linkedin')}
                title="Share on LinkedIn"
                className="bg-[#008CF1] hover:bg-[#008CF1]/90 border-none text-white"
              >
                <LinkedinIcon className="w-4 h-4 stroke-[1.25]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
                className="bg-[#008CF1] hover:bg-[#008CF1]/90 border-none text-white"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.25]" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;