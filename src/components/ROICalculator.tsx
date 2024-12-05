import { Card } from "@/components/ui/card";
import BackgroundSVG from "./BackgroundSVG";
import { SignupsSection } from "./roi-calculator/SignupsSection";
import { RevenueSection } from "./roi-calculator/RevenueSection";
import { CloseRateSection } from "./roi-calculator/CloseRateSection";
import { ResultsSection } from "./roi-calculator/ResultsSection";
import { CompanyHeader } from "./roi-calculator/CompanyHeader";
import { useToast } from "@/components/ui/use-toast";
import { sendToSlack } from "@/utils/slack";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useROICalculator } from "@/hooks/useROICalculator";
import { useEffect } from "react";

const ROICalculator = () => {
  const { toast } = useToast();
  const {
    isLoading,
    accentColor,
    savedDomain,
    domain,
    setDomain,
    setSavedDomain
  } = useCompanyData();

  const {
    signups,
    revenuePerSignup,
    closeRate,
    setSignups,
    setRevenuePerSignup,
    setCloseRate
  } = useROICalculator();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyParam = params.get('company');
    if (companyParam) {
      setDomain(companyParam);
      setSavedDomain(companyParam);
    }
  }, []);

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
    <div className="relative min-h-screen p-4 md:p-8 flex items-center justify-center min-h-screen">
      <BackgroundSVG accentColor={accentColor} />
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-white/25 backdrop-blur-xl rounded-xl -m-4" />
        <Card className="p-6 md:p-8 shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-xl relative">
          <CompanyHeader
            domain={domain}
            onDomainChange={setDomain}
            onSaveDomain={() => setSavedDomain(domain)}
            onShare={handleShare}
            savedDomain={savedDomain}
          />
          
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