import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductSelectionProps {
  selectedCategory: string;
  selectedProducts: Array<{
    id: string;
    quantity: number;
    type: 'product' | 'packaging' | 'addon';
  }>;
  onProductsUpdate: (products: Array<{
    id: string;
    quantity: number;
    type: 'product' | 'packaging' | 'addon';
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProductSelection = ({
  selectedCategory,
  selectedProducts,
  onProductsUpdate,
  onNext,
  onBack
}: ProductSelectionProps) => {
  const { toast } = useToast();
  const [localProducts, setLocalProducts] = useState(selectedProducts);

  // Fetch products for the selected category
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", selectedCategory)
        .order("name");
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory,
  });

  // Fetch packaging for the selected category
  const { data: packaging, isLoading: packagingLoading } = useQuery({
    queryKey: ["packaging", selectedCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packaging")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory,
  });

  // Fetch addons
  const { data: addons, isLoading: addonsLoading } = useQuery({
    queryKey: ["addons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addons")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch company settings for MOQ rules
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

  useEffect(() => {
    setLocalProducts(selectedProducts);
  }, [selectedProducts]);

  const updateQuantity = (id: string, type: 'product' | 'packaging' | 'addon', quantity: number) => {
    const updated = localProducts.filter(p => !(p.id === id && p.type === type));
    if (quantity > 0) {
      updated.push({ id, type, quantity });
    }
    setLocalProducts(updated);
  };

  const getQuantity = (id: string, type: 'product' | 'packaging' | 'addon') => {
    const item = localProducts.find(p => p.id === id && p.type === type);
    return item?.quantity || 0;
  };

  const validateMOQ = () => {
    if (!companySettings) return true;

    const hasAddons = localProducts.some(p => p.type === 'addon');
    const productsMOQ = hasAddons ? companySettings.products_moq_with_addon : companySettings.products_moq_without_addon;
    const packagingMOQ = hasAddons ? companySettings.packaging_moq_with_addon : companySettings.packaging_moq_without_addon;

    // Check products MOQ
    const totalProducts = localProducts
      .filter(p => p.type === 'product')
      .reduce((sum, p) => sum + p.quantity, 0);

    if (totalProducts > 0 && totalProducts < productsMOQ) {
      toast({
        title: "MOQ Requirement",
        description: `Minimum order quantity for products is ${productsMOQ}${hasAddons ? ' (with addons)' : ' (without addons)'}`,
        variant: "destructive",
      });
      return false;
    }

    // Check packaging MOQ
    const totalPackaging = localProducts
      .filter(p => p.type === 'packaging')
      .reduce((sum, p) => sum + p.quantity, 0);

    if (totalPackaging > 0 && totalPackaging < packagingMOQ) {
      toast({
        title: "MOQ Requirement",
        description: `Minimum order quantity for packaging is ${packagingMOQ}${hasAddons ? ' (with addons)' : ' (without addons)'}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (localProducts.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one product, packaging item, or addon to continue.",
        variant: "destructive",
      });
      return;
    }

    if (validateMOQ()) {
      onProductsUpdate(localProducts);
      onNext();
    }
  };

  const isLoading = productsLoading || packagingLoading || addonsLoading;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  const renderItemCard = (item: any, type: 'product' | 'packaging' | 'addon') => {
    const quantity = getQuantity(item.id, type);
    const minQuantity = type === 'product' ? item.moq || 1 : type === 'packaging' ? item.min_order_quantity || 1 : 1;

    return (
      <Card key={`${type}-${item.id}`} className="h-full">
        <CardContent className="p-4">
          <div className="aspect-square mb-3 bg-muted rounded-lg overflow-hidden">
            {item.image_url || (item.images && item.images[0]) ? (
              <img
                src={item.image_url || item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <span className="text-lg font-bold text-primary/60">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-medium mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {item.description}
            </p>
          )}
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-medium">${item.price}</span>
            </div>
            <div className="flex justify-between">
              <span>MOQ:</span>
              <span className="font-medium">{minQuantity}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Label className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateQuantity(item.id, type, Math.max(0, quantity - 1))}
                disabled={quantity <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => updateQuantity(item.id, type, Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center h-8"
                min="0"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateQuantity(item.id, type, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Products & Services</h2>
        <p className="text-muted-foreground">
          Choose your products, packaging, and add-ons. MOQ rules apply.
        </p>
      </div>

      {/* Products Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Products</h3>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => renderItemCard(product, 'product'))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No products found for this category.</p>
          </div>
        )}
      </div>

      {/* Packaging Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Packaging</h3>
        {packaging && packaging.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packaging.map((pack) => renderItemCard(pack, 'packaging'))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No packaging options available.</p>
          </div>
        )}
      </div>

      {/* Addons Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Add-ons</h3>
        {addons && addons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => renderItemCard(addon, 'addon'))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No add-ons available.</p>
          </div>
        )}
      </div>

      {/* MOQ Information */}
      {companySettings && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">MOQ Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>Products MOQ: {companySettings.products_moq_without_addon} (without addons), {companySettings.products_moq_with_addon} (with addons)</div>
            <div>Packaging MOQ: {companySettings.packaging_moq_without_addon} (without addons), {companySettings.packaging_moq_with_addon} (with addons)</div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleContinue} className="flex items-center gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductSelection;