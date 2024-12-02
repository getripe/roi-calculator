import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import BackgroundSVG from "./BackgroundSVG";
import { content, inputConfig } from "./roi-calculator/config";
import { SignupsSection } from "./roi-calculator/SignupsSection";
import { RevenueSection } from "./roi-calculator/RevenueSection";
import { CloseRateSection } from "./roi-calculator/CloseRateSection";
import { ResultsSection } from "./roi-calculator/ResultsSection";

const ROICalculator = () => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState(inputConfig.closeRates[0]);
  const [domain, setDomain] = useState("chargebee.com");

  return (
    <div className="relative min-h-screen p-8">
      <BackgroundSVG />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <div className="absolute -top-3 right-6 flex">
            <Avatar className="w-16 h-16 border-2 border-white bg-white">
              <AvatarImage 
                src="https://www.google.com/s2/favicons?domain=stripe.com&sz=128" 
                alt="Stripe Logo"
              />
              <AvatarFallback className="bg-primary text-primary-foreground">ST</AvatarFallback>
            </Avatar>
            <Avatar className="w-16 h-16 border-2 border-white -ml-6 bg-white">
              <AvatarImage 
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                alt={`${domain} Logo`}
              />
              <AvatarFallback className="bg-success text-success-foreground">
                {domain.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-4xl font-bold text-left">
              {content.title}
            </CardTitle>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="max-w-xs"
              />
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