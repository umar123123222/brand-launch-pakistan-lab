import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CategorySelection from "@/components/checkout/CategorySelection";
import ProductSelection from "@/components/checkout/ProductSelection";
import ClientInformation from "@/components/checkout/ClientInformation";

export interface CheckoutData {
  selectedCategory: string;
  selectedProducts: Array<{
    id: string;
    quantity: number;
    type: 'product' | 'packaging' | 'addon';
  }>;
  clientInfo: {
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
  };
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    selectedCategory: "",
    selectedProducts: [],
    clientInfo: {
      name: "",
    },
  });

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressValue = (currentStep / 3) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelection
            selectedCategory={checkoutData.selectedCategory}
            onCategorySelect={(category) => {
              updateCheckoutData({ selectedCategory: category });
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
            onSubmit={() => {
              // Handle checkout submission
              console.log("Checkout submitted:", checkoutData);
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
                  Step {currentStep} of 3
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