import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check } from "lucide-react";
import { CheckoutData } from "@/pages/Checkout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ConfirmationStepProps {
  checkoutData: CheckoutData;
  onBack: () => void;
  onConfirm: () => void;
}

interface ItemWithPricing {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  type: 'product' | 'packaging' | 'addon';
}

const ConfirmationStep = ({ checkoutData, onBack, onConfirm }: ConfirmationStepProps) => {
  const [products, setProducts] = useState<ItemWithPricing[]>([]);
  const [packaging, setPackaging] = useState<ItemWithPricing[]>([]);
  const [addons, setAddons] = useState<ItemWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch company settings for currency
  const { data: companySettings } = useQuery({
    queryKey: ["company-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Currency formatting function
  const formatCurrency = (amount: number) => {
    // Use PKR as default since that's your company currency
    const currency = companySettings?.currency || 'PKR';
    const symbols: { [key: string]: string } = { 
      PKR: 'Rs. ', 
      AED: 'AED ', 
      USD: '$ ',
      EUR: '€ ',
      GBP: '£ '
    };
    return `${symbols[currency] || currency + ' '}${amount.toFixed(2)}`;
  };

  useEffect(() => {
    fetchItemDetails();
  }, [checkoutData.selectedProducts]);

  const fetchItemDetails = async () => {
    try {
      const productIds = checkoutData.selectedProducts
        .filter(p => p.type === 'product')
        .map(p => p.id);
      
      const packagingIds = checkoutData.selectedProducts
        .filter(p => p.type === 'packaging')
        .map(p => p.id);
      
      const addonIds = checkoutData.selectedProducts
        .filter(p => p.type === 'addon')
        .map(p => p.id);

      const [productsData, packagingData, addonsData] = await Promise.all([
        productIds.length > 0 ? supabase.from('products').select('*').in('id', productIds) : { data: [] },
        packagingIds.length > 0 ? supabase.from('packaging').select('*').in('id', packagingIds) : { data: [] },
        addonIds.length > 0 ? supabase.from('addons').select('*').in('id', addonIds) : { data: [] },
      ]);

      const processItems = (items: any[], type: 'product' | 'packaging' | 'addon'): ItemWithPricing[] => {
        return items?.map(item => {
          const selectedItem = checkoutData.selectedProducts.find(p => p.id === item.id && p.type === type);
          const quantity = selectedItem?.quantity || 0;
          const price = Number(item.price) || 0;
          return {
            id: item.id,
            name: item.name,
            quantity,
            price,
            total: quantity * price,
            type
          };
        }).filter(item => item.quantity > 0) || [];
      };

      setProducts(processItems(productsData.data, 'product'));
      setPackaging(processItems(packagingData.data, 'packaging'));
      setAddons(processItems(addonsData.data, 'addon'));
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast({
        title: "Error",
        description: "Failed to load item details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (items: ItemWithPricing[]) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const productsTotal = calculateSubtotal(products);
  const packagingTotal = calculateSubtotal(packaging);
  const addonsTotal = calculateSubtotal(addons);
  const grandTotal = productsTotal + packagingTotal + addonsTotal;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      // Create a summary message of their selections
      const selectedItems = [];
      
      if (products.length > 0) {
        selectedItems.push(`Products: ${products.map(p => `${p.name} (${p.quantity})`).join(', ')}`);
      }
      
      if (packaging.length > 0) {
        selectedItems.push(`Packaging: ${packaging.map(p => `${p.name} (${p.quantity})`).join(', ')}`);
      }
      
      if (addons.length > 0) {
        selectedItems.push(`Addons: ${addons.map(a => `${a.name} (${a.quantity})`).join(', ')}`);
      }

      const message = [
        `Business Name: ${checkoutData.clientInfo.businessName || 'Not provided'}`,
        `CNIC: ${checkoutData.clientInfo.cnicNumber || 'Not provided'}`,
        `NTN: ${checkoutData.clientInfo.businessNtn || 'Not provided'}`,
        `Labels: ${checkoutData.clientInfo.labels || 'Not provided'}`,
        `Total Amount: ${formatCurrency(grandTotal)}`,
        ...selectedItems
      ].join(' | ');

      // Save to front_leads table
      const { error } = await supabase
        .from('front_leads')
        .insert([{
          name: checkoutData.clientInfo.name,
          email: checkoutData.clientInfo.email,
          phone_number: checkoutData.clientInfo.phone,
          message: message,
          'product _category': checkoutData.selectedCategory
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your inquiry has been submitted successfully.",
      });

      onConfirm();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading confirmation details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>Name:</strong> {checkoutData.clientInfo.name}</div>
          <div><strong>Email:</strong> {checkoutData.clientInfo.email}</div>
          <div><strong>Phone:</strong> {checkoutData.clientInfo.phone}</div>
          <div><strong>Business Name:</strong> {checkoutData.clientInfo.businessName}</div>
          <div><strong>CNIC Number:</strong> {checkoutData.clientInfo.cnicNumber}</div>
          {checkoutData.clientInfo.businessNtn && <div><strong>NTN:</strong> {checkoutData.clientInfo.businessNtn}</div>}
          <div className="flex gap-4 mt-4">
            {checkoutData.clientInfo.cnicFrontImage && (
              <div>
                <p className="text-sm font-medium">CNIC Front:</p>
                <p className="text-sm text-muted-foreground">{checkoutData.clientInfo.cnicFrontImage.name}</p>
              </div>
            )}
            {checkoutData.clientInfo.cnicBackImage && (
              <div>
                <p className="text-sm font-medium">CNIC Back:</p>
                <p className="text-sm text-muted-foreground">{checkoutData.clientInfo.cnicBackImage.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{product.name}</div>
                     <div className="text-sm text-muted-foreground">
                       {product.quantity} × {formatCurrency(product.price)}
                     </div>
                   </div>
                   <div className="font-medium">{formatCurrency(product.total)}</div>
                </div>
              ))}
              <Separator />
               <div className="flex justify-between font-semibold">
                 <span>Products Total:</span>
                 <span>{formatCurrency(productsTotal)}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Packaging */}
      {packaging.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Packaging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packaging.map((pack) => (
                <div key={pack.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{pack.name}</div>
                     <div className="text-sm text-muted-foreground">
                       {pack.quantity} × {formatCurrency(pack.price)}
                     </div>
                   </div>
                   <div className="font-medium">{formatCurrency(pack.total)}</div>
                </div>
              ))}
              <Separator />
               <div className="flex justify-between font-semibold">
                 <span>Packaging Total:</span>
                 <span>{formatCurrency(packagingTotal)}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Addons */}
      {addons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Addons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addons.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{addon.name}</div>
                     <div className="text-sm text-muted-foreground">
                       {addon.quantity} × {formatCurrency(addon.price)}
                     </div>
                   </div>
                   <div className="font-medium">{formatCurrency(addon.total)}</div>
                </div>
              ))}
              <Separator />
               <div className="flex justify-between font-semibold">
                 <span>Addons Total:</span>
                 <span>{formatCurrency(addonsTotal)}</span>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grand Total */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
           <div className="flex justify-between items-center text-xl font-bold">
             <span>Total Invoice Amount:</span>
             <span className="text-primary">{formatCurrency(grandTotal)}</span>
           </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={saving}
          className="flex-1"
        >
          {saving ? "Confirming..." : "Confirm Order"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;