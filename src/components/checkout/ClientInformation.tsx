import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { ArrowLeft, InfoIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessBankDetails?: string;
  businessWebsite?: string;
  businessNtn?: string;
  businessStrn?: string;
  labels?: string;
  cnicNumber: string;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
}

interface ClientInformationProps {
  clientInfo: ClientInfo;
  onClientInfoUpdate: (clientInfo: ClientInfo) => void;
  onBack: () => void;
  onNext: () => void;
}

const ClientInformation = ({
  clientInfo,
  onClientInfoUpdate,
  onBack,
  onNext
}: ClientInformationProps) => {
  const { toast } = useToast();
  const [localClientInfo, setLocalClientInfo] = useState<ClientInfo>(clientInfo);
  const [existingClientId, setExistingClientId] = useState<string | null>(null);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [isCheckingClient, setIsCheckingClient] = useState(false);

  const updateField = (field: keyof ClientInfo, value: string | File | null) => {
    const updated = { ...localClientInfo, [field]: value };
    setLocalClientInfo(updated);
    onClientInfoUpdate(updated);
  };

  // Function to check for existing client
  const checkExistingClient = async (email: string, phone: string) => {
    if (!email && !phone) return;
    
    setIsCheckingClient(true);
    try {
      const { data, error } = await supabase.rpc('find_existing_client', {
        email_input: email || null,
        phone_input: phone || null
      });

      if (error) {
        console.error('Error checking existing client:', error);
        return;
      }

      if (data) {
        // Fetch full client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', data)
          .single();

        if (!clientError && clientData) {
          setExistingClientId(data);
          setIsExistingClient(true);
          
          // Pre-populate form with existing client data
          const updatedInfo = {
            ...localClientInfo,
            name: clientData.name || localClientInfo.name,
            email: clientData.email || localClientInfo.email,
            phone: clientData.phone || localClientInfo.phone,
            address: clientData.address || localClientInfo.address,
            businessName: clientData.brand_name || localClientInfo.businessName,
            businessEmail: clientData.business_email || localClientInfo.businessEmail,
            businessPhone: clientData.business_number || localClientInfo.businessPhone,
            businessBankDetails: clientData.bank_details || localClientInfo.businessBankDetails,
            businessWebsite: clientData.domain || localClientInfo.businessWebsite,
            businessNtn: clientData.ntn || localClientInfo.businessNtn,
            businessStrn: clientData.strn || localClientInfo.businessStrn,
            labels: clientData.labels_details || localClientInfo.labels,
            cnicNumber: clientData.cnic_number || localClientInfo.cnicNumber,
          };
          
          setLocalClientInfo(updatedInfo);
          onClientInfoUpdate(updatedInfo);
          
          toast({
            title: "Existing Client Found",
            description: "We found your information and pre-filled the form. You can update any details as needed.",
          });
        }
      } else {
        setExistingClientId(null);
        setIsExistingClient(false);
      }
    } catch (error) {
      console.error('Error checking client:', error);
    } finally {
      setIsCheckingClient(false);
    }
  };

  // Check for existing client when email or phone changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localClientInfo.email || localClientInfo.phone) {
        checkExistingClient(localClientInfo.email, localClientInfo.phone);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [localClientInfo.email, localClientInfo.phone]);

  const handleNext = () => {
    // Required field validations
    if (!localClientInfo.name.trim()) {
      toast({
        title: "Required Field",
        description: "Client name is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.phone.trim()) {
      toast({
        title: "Required Field",
        description: "Phone number is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.email.trim()) {
      toast({
        title: "Required Field",
        description: "Email address is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.businessName.trim()) {
      toast({
        title: "Required Field",
        description: "Business name is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.address.trim()) {
      toast({
        title: "Required Field",
        description: "Address is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.cnicNumber.trim()) {
      toast({
        title: "Required Field",
        description: "CNIC number is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.cnicFrontImage) {
      toast({
        title: "Required Field",
        description: "CNIC front image is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!localClientInfo.cnicBackImage) {
      toast({
        title: "Required Field",
        description: "CNIC back image is required to continue.",
        variant: "destructive",
      });
      return;
    }

    // Email format validations
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localClientInfo.email)) {
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

    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Client Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact details to complete the checkout
        </p>
      </div>

      {/* Existing Client Alerts */}
      {isCheckingClient && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Checking for existing client information...
          </AlertDescription>
        </Alert>
      )}
      
      {isExistingClient && (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            We found existing information for this client and pre-filled the form. 
            You can review and update any details as needed.
          </AlertDescription>
        </Alert>
      )}

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
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <PhoneInput
                  id="phone"
                  value={localClientInfo.phone || ''}
                  onChange={(value) => updateField('phone', value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={localClientInfo.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={localClientInfo.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="cnicNumber" className="text-sm font-medium">
                CNIC Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cnicNumber"
                value={localClientInfo.cnicNumber || ''}
                onChange={(e) => updateField('cnicNumber', e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnicFront" className="text-sm font-medium">
                  CNIC Front Side <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnicFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateField('cnicFrontImage', file);
                  }}
                  required
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-input file:text-input-foreground hover:file:bg-input/80 cursor-pointer"
                />
                {localClientInfo.cnicFrontImage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {localClientInfo.cnicFrontImage.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cnicBack" className="text-sm font-medium">
                  CNIC Back Side <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnicBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateField('cnicBackImage', file);
                  }}
                  required
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-input file:text-input-foreground hover:file:bg-input/80 cursor-pointer"
                />
                {localClientInfo.cnicBackImage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {localClientInfo.cnicBackImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Business Information</h3>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="businessName"
                value={localClientInfo.businessName || ''}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="Your business name"
                required
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
        <Button variant="secondary" onClick={onBack} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex items-center gap-2 w-full sm:w-auto">
          Continue to Confirmation
        </Button>
      </div>
    </div>
  );
};

export default ClientInformation;