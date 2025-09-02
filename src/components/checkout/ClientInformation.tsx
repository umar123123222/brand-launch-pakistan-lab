import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientInfo {
  name: string;
  phone?: string;
  email?: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessBankDetails?: string;
  businessWebsite?: string;
  businessNtn?: string;
  businessStrn?: string;
  labels?: string;
}

interface ClientInformationProps {
  clientInfo: ClientInfo;
  onClientInfoUpdate: (clientInfo: ClientInfo) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const ClientInformation = ({
  clientInfo,
  onClientInfoUpdate,
  onBack,
  onSubmit
}: ClientInformationProps) => {
  const { toast } = useToast();
  const [localClientInfo, setLocalClientInfo] = useState<ClientInfo>(clientInfo);

  const updateField = (field: keyof ClientInfo, value: string) => {
    const updated = { ...localClientInfo, [field]: value };
    setLocalClientInfo(updated);
    onClientInfoUpdate(updated);
  };

  const handleSubmit = () => {
    if (!localClientInfo.name.trim()) {
      toast({
        title: "Required Field",
        description: "Client name is required to complete the checkout.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format if provided
    if (localClientInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localClientInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (localClientInfo.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localClientInfo.businessEmail)) {
      toast({
        title: "Invalid Business Email",
        description: "Please enter a valid business email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Checkout Submitted",
      description: "Your order has been submitted successfully!",
    });

    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Client Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact details to complete the checkout
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={localClientInfo.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <PhoneInput
                  id="phone"
                  value={localClientInfo.phone || ''}
                  onChange={(value) => updateField('phone', value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={localClientInfo.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Business Information (Optional)</h3>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={localClientInfo.businessName || ''}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="Your business name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessEmail" className="text-sm font-medium">
                  Business Email
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={localClientInfo.businessEmail || ''}
                  onChange={(e) => updateField('businessEmail', e.target.value)}
                  placeholder="business@email.com"
                />
              </div>

              <div>
                <Label htmlFor="businessPhone" className="text-sm font-medium">
                  Business Phone
                </Label>
                <PhoneInput
                  id="businessPhone"
                  value={localClientInfo.businessPhone || ''}
                  onChange={(value) => updateField('businessPhone', value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessWebsite" className="text-sm font-medium">
                Business Website Domain
              </Label>
              <Input
                id="businessWebsite"
                value={localClientInfo.businessWebsite || ''}
                onChange={(e) => updateField('businessWebsite', e.target.value)}
                placeholder="www.yourbusiness.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessNtn" className="text-sm font-medium">
                  Business NTN
                </Label>
                <Input
                  id="businessNtn"
                  value={localClientInfo.businessNtn || ''}
                  onChange={(e) => updateField('businessNtn', e.target.value)}
                  placeholder="National Tax Number"
                />
              </div>

              <div>
                <Label htmlFor="businessStrn" className="text-sm font-medium">
                  Business STRN
                </Label>
                <Input
                  id="businessStrn"
                  value={localClientInfo.businessStrn || ''}
                  onChange={(e) => updateField('businessStrn', e.target.value)}
                  placeholder="Sales Tax Registration Number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessBankDetails" className="text-sm font-medium">
                Business Bank Details
              </Label>
              <Textarea
                id="businessBankDetails"
                value={localClientInfo.businessBankDetails || ''}
                onChange={(e) => updateField('businessBankDetails', e.target.value)}
                placeholder="Bank name, account number, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="labels" className="text-sm font-medium">
                Labels/Tags
              </Label>
              <Input
                id="labels"
                value={localClientInfo.labels || ''}
                onChange={(e) => updateField('labels', e.target.value)}
                placeholder="Any special labels or tags"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          Complete Checkout
        </Button>
      </div>
    </div>
  );
};

export default ClientInformation;