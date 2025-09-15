import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CategorySelection from "@/components/checkout/CategorySelection";
import ProductSelection from "@/components/checkout/ProductSelection";
import ClientInformation from "@/components/checkout/ClientInformation";
import ConfirmationStep from "@/components/checkout/ConfirmationStep";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface CheckoutData {
  selectedCategory: string;
  selectedProducts: Array<{
    id: string;
    quantity: number;
    type: 'product' | 'packaging' | 'addon';
  }>;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
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
  };
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedCategory: "",
    selectedProducts: [],
    clientInfo: {
      name: "",
      phone: "",
      email: "",
      businessName: "",
      cnicNumber: "",
      cnicFrontImage: null,
      cnicBackImage: null,
    },
  });

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressValue = (currentStep / 4) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelection
            selectedCategory={checkoutData.selectedCategory}
            onCategorySelect={(categoryName) => {
              updateCheckoutData({ selectedCategory: categoryName });
            }}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProductSelection
            selectedCategory={checkoutData.selectedCategory}
            selectedProducts={checkoutData.selectedProducts}
            onProductsUpdate={(products) => {
              updateCheckoutData({ selectedProducts: products });
            }}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ClientInformation
            clientInfo={checkoutData.clientInfo}
            onClientInfoUpdate={(clientInfo) => {
              updateCheckoutData({ clientInfo });
            }}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            checkoutData={checkoutData}
            onBack={prevStep}
           onConfirm={async () => {
             try {
               // Create or get client
               const { data: clientId, error: clientError } = await supabase.rpc(
                 'get_or_create_client_by_contact',
                 {
                   email_input: checkoutData.clientInfo.email,
                   phone_input: checkoutData.clientInfo.phone,
                   name_input: checkoutData.clientInfo.name,
                   brand_name_input: checkoutData.clientInfo.businessName,
                   business_email_input: checkoutData.clientInfo.businessEmail,
                   domain_input: checkoutData.clientInfo.businessWebsite,
                   niche_input: checkoutData.clientInfo.labels
                 }
               );

               if (clientError) {
                 throw new Error(`Failed to create client: ${clientError.message}`);
               }

               // Upload CNIC images if provided
               const uploadPromises = [];
               if (checkoutData.clientInfo.cnicFrontImage) {
                 const frontPath = `${clientId}/cnic_front_${Date.now()}`;
                 uploadPromises.push(
                   supabase.storage
                     .from('cnic-documents')
                     .upload(frontPath, checkoutData.clientInfo.cnicFrontImage)
                 );
               }
               
               if (checkoutData.clientInfo.cnicBackImage) {
                 const backPath = `${clientId}/cnic_back_${Date.now()}`;
                 uploadPromises.push(
                   supabase.storage
                     .from('cnic-documents')
                     .upload(backPath, checkoutData.clientInfo.cnicBackImage)
                 );
               }

               // Wait for uploads to complete
               if (uploadPromises.length > 0) {
                 await Promise.all(uploadPromises);
               }

               // Save selected products
               const productInserts = checkoutData.selectedProducts
                 .filter(item => item.type === 'product')
                 .map(item => ({
                   client_id: clientId,
                   product_id: item.id,
                   quantity: item.quantity
                 }));

               // Save selected packaging
               const packagingInserts = checkoutData.selectedProducts
                 .filter(item => item.type === 'packaging')
                 .map(item => ({
                   client_id: clientId,
                   packaging_id: item.id,
                   quantity: item.quantity
                 }));

               // Save selected addons
               const addonInserts = checkoutData.selectedProducts
                 .filter(item => item.type === 'addon')
                 .map(item => ({
                   client_id: clientId,
                   addon_id: item.id,
                   quantity: item.quantity
                 }));

               // Insert all product/packaging/addon selections
               const insertPromises = [];
               
               if (productInserts.length > 0) {
                 insertPromises.push(supabase.from('client_products').insert(productInserts));
               }
               
               if (packagingInserts.length > 0) {
                 insertPromises.push(supabase.from('client_packaging').insert(packagingInserts));
               }
               
               if (addonInserts.length > 0) {
                 insertPromises.push(supabase.from('client_addons').insert(addonInserts));
               }

               if (insertPromises.length > 0) {
                 const results = await Promise.all(insertPromises);
                 results.forEach((result, index) => {
                   if (result.error) {
                     console.error(`Error saving selections:`, result.error);
                   }
                 });
               }

               toast({
                 title: "Success!",
                 description: "Your order has been submitted successfully.",
               });

                // Navigate to checkout thank you page
                navigate('/checkout/thank-you');
               
             } catch (error) {
               console.error("Checkout error:", error);
               toast({
                 title: "Error",
                 description: "Failed to submit your order. Please try again.",
                 variant: "destructive",
               });
               throw error;
             }
           }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of 4
                </div>
              </div>
              <Progress value={progressValue} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>
                  Choose Category
                </span>
                <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>
                  Select Products
                </span>
                <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>
                  Client Information
                </span>
                <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>
                  Confirmation
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;