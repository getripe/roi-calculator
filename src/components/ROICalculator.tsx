import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, Settings2 } from "lucide-react";
import BackgroundSVG from "./BackgroundSVG";
import { content, inputConfig } from "./roi-calculator/config";
import { SignupsSection } from "./roi-calculator/SignupsSection";
import { RevenueSection } from "./roi-calculator/RevenueSection";
import { CloseRateSection } from "./roi-calculator/CloseRateSection";
import { ResultsSection } from "./roi-calculator/ResultsSection";
import { useToast } from "@/components/ui/use-toast";
import { sendToSlack } from "@/utils/slack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ROICalculator = () => {
  const [signups, setSignups] = useState(inputConfig.signups.default);
  const [revenuePerSignup, setRevenuePerSignup] = useState(inputConfig.revenue.default);
  const [closeRate, setCloseRate] = useState("30");
  const [domain, setDomain] = useState("chargebee.com");
  const [savedDomain, setSavedDomain] = useState("chargebee.com");
  const [slackWebhook, setSlackWebhook] = useState(() => localStorage.getItem('slackWebhook') || '');
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

  const handleShare = async () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    // Add all parameters
    params.set('company', domain);
    params.set('qualified', signups.toString());
    params.set('contract', revenuePerSignup.toString());
    params.set('rate', closeRate);

    const shareableUrl = `${baseUrl}?${params.toString()}`;

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareableUrl);
      
      // If Slack webhook is configured, send notification
      if (slackWebhook) {
        try {
          await sendToSlack(slackWebhook, {
            domain: savedDomain,
            qualifiedSignups: signups,
            revenuePerDeal: revenuePerSignup,
            closeRate: closeRate,
          });
          toast({
            title: "Shared!",
            description: "URL copied and notification sent to Slack",
          });
        } catch (error) {
          toast({
            title: "URL Copied!",
            description: "But failed to send to Slack. Please check your webhook URL.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "URL Copied!",
          description: "Share this URL to show your ROI calculation",
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

  const handleSaveWebhook = (url: string) => {
    setSlackWebhook(url);
    localStorage.setItem('slackWebhook', url);
    toast({
      title: "Slack Webhook Saved",
      description: "Your Slack notifications have been configured",
    });
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <BackgroundSVG />
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
              {content.title}
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
                  onClick={() => setSavedDomain(domain)}
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  Save
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <Settings2 className="h-4 w-4" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Slack Integration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        type="text"
                        placeholder="Enter Slack Webhook URL"
                        value={slackWebhook}
                        onChange={(e) => setSlackWebhook(e.target.value)}
                      />
                      <Button 
                        onClick={() => handleSaveWebhook(slackWebhook)}
                        className="w-full"
                      >
                        Save Webhook
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
