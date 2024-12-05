import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import BackgroundSVG from "./BackgroundSVG";
import { content, inputConfig } from "./roi-calculator/config";
import { SignupsSection } from "./roi-calculator/SignupsSection";
import { RevenueSection } from "./roi-calculator/RevenueSection";
import { CloseRateSection } from "./roi-calculator/CloseRateSection";
import { ResultsSection } from "./roi-calculator/ResultsSection";
import { useToast } from "@/components/ui/use-toast";
import { sendToSlack } from "@/utils/slack";

const ROICalculator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState("30");
  const [domain, setDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const { toast } = useToast();

  const getCompanyName = (domain: string) => {
    if (!domain) return "";
    const company = domain.split('.')[0];
    return company.charAt(0).toUpperCase() + company.slice(1);
  };

  // Handle URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyParam = params.get('company');
    const qualifiedParam = params.get('qualified');
    const contractParam = params.get('contract');
    const rateParam = params.get('rate');

    if (companyParam) {
      setDomain(companyParam);
      setSavedDomain(companyParam);
    } else {
      setDomain("chargebee.com");
      setSavedDomain("chargebee.com");
    }
    if (qualifiedParam) {
      setSignups(Number(qualifiedParam));
    }
    if (contractParam) {
      setRevenuePerSignup(Number(contractParam));
    }
    if (rateParam) {
      setCloseRate(rateParam);
    }
  }, []);

  useEffect(() => {
    if (!savedDomain) return;

    const extractDominantColor = async (imageUrl: string) => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
        if (!imageData) return;

        // Create a map to store color frequencies
        const colorMap = new Map();

        // Process each pixel
        for (let i = 0; i < imageData.length; i += 4) {
          if (imageData[i + 3] > 128) { // Only consider mostly opaque pixels
            const r = Math.round(imageData[i] / 32) * 32;     // Quantize to reduce colors
            const g = Math.round(imageData[i + 1] / 32) * 32;
            const b = Math.round(imageData[i + 2] / 32) * 32;
            
            // Skip white, black, and very light/dark colors
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 235) continue;
            
            const key = `${r},${g},${b}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
          }
        }

        // Find the most frequent color
        let maxCount = 0;
        let dominantColor = '#12ED8A'; // Default color

        colorMap.forEach((count, color) => {
          if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = color.split(',').map(Number);
            dominantColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          }
        });

        setAccentColor(dominantColor);
      } catch (error) {
        console.error('Error extracting color:', error);
        setAccentColor("#12ED8A"); // Fallback color
      } finally {
        setIsLoading(false);
      }
    };

    const logoUrl = `https://logo.clearbit.com/${savedDomain}`;
    extractDominantColor(logoUrl);
  }, [savedDomain]);

  const handleSaveDomain = () => {
    setSavedDomain(domain);
  };

  const handleShare = async () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    params.set('company', domain);
    params.set('qualified', signups.toString());
    params.set('contract', revenuePerSignup.toString());
    params.set('rate', closeRate);

    const shareableUrl = `${baseUrl}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareableUrl);
      
      try {
        await sendToSlack({
          domain: savedDomain,
          qualifiedSignups: signups,
          revenuePerDeal: revenuePerSignup,
          closeRate: closeRate,
        });
        toast({
          title: "URL Copied!",
          description: "Link has been copied to your clipboard",
        });
      } catch (error) {
        toast({
          title: "URL Copied!",
          description: "Link has been copied to your clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Couldn't copy URL",
        description: "Please copy this URL manually: " + shareableUrl,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !savedDomain || !accentColor) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <BackgroundSVG accentColor={accentColor} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-white/25 backdrop-blur-xl rounded-xl -m-4" />
        <Card className="p-6 md:p-8 shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-xl relative">
          <div className="absolute -top-8 -right-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg bg-white">
              <AvatarImage 
                src={`https://www.google.com/s2/favicons?domain=${savedDomain}&sz=128`}
                alt={`${savedDomain} Logo`}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {savedDomain.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-left mb-6 text-black">
              ROI Calculator for {getCompanyName(savedDomain)}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Input
                type="text"
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 max-w-xs"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveDomain}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 shadow-sm hover:shadow-md transition-all"
                  style={{ backgroundColor: "#7512ED", color: "white" }}
                >
                  <Link2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <div className="space-y-10">
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;