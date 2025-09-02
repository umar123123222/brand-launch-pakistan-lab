import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check } from "lucide-react";
import { CheckoutData } from "@/pages/Checkout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const uploadFile = async (file: File, folder: string, filename: string) => {
    const { data, error } = await supabase.storage
      .from('cnic-documents')
      .upload(`${folder}/${filename}`, file);
    
    if (error) throw error;
    return data.path;
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      // Upload CNIC images
      let cnicFrontPath = '';
      let cnicBackPath = '';
      
      if (checkoutData.clientInfo.cnicFrontImage) {
        const frontFilename = `cnic_front_${Date.now()}_${checkoutData.clientInfo.cnicFrontImage.name}`;
        cnicFrontPath = await uploadFile(checkoutData.clientInfo.cnicFrontImage, 'cnic_front', frontFilename);
      }
      
      if (checkoutData.clientInfo.cnicBackImage) {
        const backFilename = `cnic_back_${Date.now()}_${checkoutData.clientInfo.cnicBackImage.name}`;
        cnicBackPath = await uploadFile(checkoutData.clientInfo.cnicBackImage, 'cnic_back', backFilename);
      }

      // Save client data
      const clientData = {
        name: checkoutData.clientInfo.name,
        email: checkoutData.clientInfo.email,
        phone: checkoutData.clientInfo.phone,
        brand_name: checkoutData.clientInfo.businessName,
        cnic_number: checkoutData.clientInfo.cnicNumber,
        cnic_front_image: cnicFrontPath,
        cnic_back_image: cnicBackPath,
        ntn: checkoutData.clientInfo.businessNtn,
        labels_name: checkoutData.clientInfo.labels,
        total_value: grandTotal,
        status: 'active',
      };

      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (clientError) throw clientError;

      // Save selected products
      if (products.length > 0) {
        const productInserts = products.map(product => ({
          client_id: client.id,
          product_id: product.id,
          quantity: product.quantity
        }));

        const { error: productsError } = await supabase
          .from('client_products')
          .insert(productInserts);

        if (productsError) throw productsError;
      }

      // Save selected packaging
      if (packaging.length > 0) {
        const packagingInserts = packaging.map(pack => ({
          client_id: client.id,
          packaging_id: pack.id,
          quantity: pack.quantity
        }));

        const { error: packagingError } = await supabase
          .from('client_packaging')
          .insert(packagingInserts);

        if (packagingError) throw packagingError;
      }

      // Save selected addons
      if (addons.length > 0) {
        const addonInserts = addons.map(addon => ({
          client_id: client.id,
          addon_id: addon.id,
          quantity: addon.quantity
        }));

        const { error: addonsError } = await supabase
          .from('client_addons')
          .insert(addonInserts);

        if (addonsError) throw addonsError;
      }

      toast({
        title: "Success!",
        description: "Your order has been confirmed successfully.",
      });

      onConfirm();
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: "Failed to save your order. Please try again.",
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
                      {product.quantity} × ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">${product.total.toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Products Total:</span>
                <span>${productsTotal.toFixed(2)}</span>
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
                      {pack.quantity} × ${pack.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">${pack.total.toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Packaging Total:</span>
                <span>${packagingTotal.toFixed(2)}</span>
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
                      {addon.quantity} × ${addon.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">${addon.total.toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Addons Total:</span>
                <span>${addonsTotal.toFixed(2)}</span>
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
            <span className="text-primary">${grandTotal.toFixed(2)}</span>
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