import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

interface CompanyHeaderProps {
  domain: string;
  onDomainChange: (value: string) => void;
  onSaveDomain: () => void;
  onShare: () => void;
  savedDomain: string;
}

export const CompanyHeader = ({
  domain,
  onDomainChange,
  onSaveDomain,
  onShare,
  savedDomain
}: CompanyHeaderProps) => {
  const getCompanyName = (domain: string) => {
    if (!domain) return "";
    const company = domain.split('.')[0];
    return company.charAt(0).toUpperCase() + company.slice(1);
  };

  return (
    <CardHeader className="p-0 mb-8">
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
      
      <CardTitle className="text-3xl md:text-4xl font-bold text-left mb-6 text-black pb-4">
        ROI Calculator for {getCompanyName(savedDomain)}
      </CardTitle>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Input
          type="text"
          placeholder="Enter domain (e.g., example.com)"
          value={domain}
          onChange={(e) => onDomainChange(e.target.value)}
          className="flex-1 max-w-xs"
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSaveDomain}
            className="shadow-sm hover:shadow-md transition-all"
          >
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="gap-2 shadow-sm hover:shadow-md transition-all"
            style={{ backgroundColor: "#7512ED", color: "white" }}
          >
            <Link2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};