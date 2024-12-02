import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";

const ROICalculator = () => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState(inputConfig.closeRates[0]);
  const [domain, setDomain] = useState("chargebee.com");
  const [savedDomain, setSavedDomain] = useState("chargebee.com");
  const { toast } = useToast();

  useEffect(() => {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const companyUrl = urlParams.get('company');
    const qualifiedParam = urlParams.get('qualified');
    const contractParam = urlParams.get('contract');
    const closeRateParam = urlParams.get('rate');
    
    if (companyUrl) {
      try {
        const url = new URL(companyUrl.startsWith('http') ? companyUrl : `https://${companyUrl}`);
        const cleanDomain = url.hostname.replace('www.', '');
        setDomain(cleanDomain);
        setSavedDomain(cleanDomain);
      } catch (error) {
        console.error('Invalid URL parameter:', error);
      }
    }

    // Set qualified signups if provided
    if (qualifiedParam) {
      const qualifiedValue = parseInt(qualifiedParam);
      if (!isNaN(qualifiedValue) && qualifiedValue >= 0 && qualifiedValue <= inputConfig.signups.max) {
        setSignups(qualifiedValue);
      }
    }

    // Set contract value if provided
    if (contractParam) {
      const contractValue = parseInt(contractParam);
      if (!isNaN(contractValue) && contractValue >= 0 && contractValue <= inputConfig.revenue.max) {
        setRevenuePerSignup(contractValue);
      }
    }

    // Set close rate if provided
    if (closeRateParam) {
      const closeRateValue = closeRateParam;
      if (inputConfig.closeRates.includes(closeRateValue)) {
        setCloseRate(closeRateValue);
      }
    }
  }, []);

  const handleSaveDomain = () => {
    setSavedDomain(domain);
  };

  return (
    <div className="relative min-h-screen p-8">
      <BackgroundSVG />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="absolute -top-3 right-6">
            <Avatar className="w-16 h-16 border-2 border-white bg-white">
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;