import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Plus, Minus, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
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
      if (!selectedCategory) return [];
      
      // First get the category ID from the category name
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", selectedCategory)
        .single();
      
      if (categoryError) throw categoryError;
      if (!categoryData) return [];
      
      // Then fetch products using the category ID
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("Category", categoryData.id)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCategory,
  });

  // Fetch packaging for the selected category
  const { data: packaging, isLoading: packagingLoading } = useQuery({
    queryKey: ["packaging", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      // First get the category ID from the category name
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", selectedCategory)
        .single();
      
      if (categoryError) throw categoryError;
      if (!categoryData) return [];
      
      // Then fetch packaging using the category ID
      const { data, error } = await supabase
        .from("packaging")
        .select("*")
        .eq("Category", categoryData.id)
        .order("name");
      
      if (error) throw error;
      return data || [];
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
    return `${symbols[currency] || currency + ' '}${amount}`;
  };

  useEffect(() => {
    setLocalProducts(selectedProducts);
  }, [selectedProducts]);

  const updateQuantity = (id: string, type: 'product' | 'packaging' | 'addon', quantity: number) => {
    const updated = localProducts.filter(p => !(p.id === id && p.type === type));
    if (quantity > 0) {
      updated.push({ id, type, quantity });
    }
    
    // Auto-sync packaging quantities with total product quantity
    if (type === 'product') {
      const newLocalProducts = [...updated];
      const totalProducts = newLocalProducts
        .filter(p => p.type === 'product')
        .reduce((sum, p) => sum + p.quantity, 0);
      
      // Update all existing packaging items to match total product quantity
      const packagingItems = newLocalProducts.filter(p => p.type === 'packaging');
      packagingItems.forEach(item => {
        const index = newLocalProducts.findIndex(p => p.id === item.id && p.type === 'packaging');
        if (index !== -1 && totalProducts > 0) {
          newLocalProducts[index].quantity = totalProducts;
        }
      });
      
      setLocalProducts(newLocalProducts);
    } else {
      setLocalProducts(updated);
    }
  };

  const handleQuantityDecrease = (item: any, type: 'product' | 'packaging' | 'addon') => {
    const quantity = getQuantity(item.id, type);
    const minQuantity = type === 'product' ? item.moq || 1 : type === 'packaging' ? item.min_order_quantity || 1 : 1;
    
    // For packaging, auto-sync with total products - don't allow manual changes
    if (type === 'packaging') {
      const totalProducts = localProducts
        .filter(p => p.type === 'product')
        .reduce((sum, p) => sum + p.quantity, 0);
      
      if (totalProducts > 0) {
        updateQuantity(item.id, type, 0); // Remove packaging if no products
      }
      return;
    }
    
    if (quantity <= minQuantity) {
      // If at or below MOQ, go to 0
      updateQuantity(item.id, type, 0);
    } else {
      // If above MOQ, decrease by 1
      updateQuantity(item.id, type, quantity - 1);
    }
  };

  const handleQuantityIncrease = (item: any, type: 'product' | 'packaging' | 'addon') => {
    const quantity = getQuantity(item.id, type);
    const minQuantity = type === 'product' ? item.moq || 1 : type === 'packaging' ? item.min_order_quantity || 1 : 1;
    
    // For packaging, auto-sync with total products - don't allow manual changes  
    if (type === 'packaging') {
      const totalProducts = localProducts
        .filter(p => p.type === 'product')
        .reduce((sum, p) => sum + p.quantity, 0);
      
      if (totalProducts > 0) {
        updateQuantity(item.id, type, totalProducts); // Set packaging to total products
      }
      return;
    }
    
    if (quantity === 0) {
      // If at 0, jump to MOQ
      updateQuantity(item.id, type, minQuantity);
    } else {
      // If above 0, increase by 1
      updateQuantity(item.id, type, quantity + 1);
    }
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

    // Check individual product MOQs first
    const selectedProducts = localProducts.filter(p => p.type === 'product');
    for (const selectedProduct of selectedProducts) {
      const productData = products?.find(p => p.id === selectedProduct.id);
      const individualMOQ = productData?.moq || 1;
      
      if (selectedProduct.quantity < individualMOQ) {
        toast({
          title: "Individual Product MOQ Not Met",
          description: `${productData?.name || 'Product'} requires minimum ${individualMOQ} pieces, but you selected ${selectedProduct.quantity}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Check total products MOQ (company requirement)
    const totalProducts = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

    if (totalProducts > 0 && totalProducts < productsMOQ) {
      toast({
        title: "Company Products MOQ Requirement",
        description: `Total products minimum order is ${productsMOQ} pieces${hasAddons ? ' (with addons)' : ' (without addons)'}. You have ${totalProducts} pieces.`,
        variant: "destructive",
      });
      return false;
    }

    // Check packaging requirements
    const selectedPackaging = localProducts.filter(p => p.type === 'packaging');
    const totalPackaging = selectedPackaging.reduce((sum, p) => sum + p.quantity, 0);
    const hasPackaging = selectedPackaging.length > 0;

    if (hasPackaging) {
      // 1. Check packaging quantity equals product quantity (user requirement)
      if (totalProducts > 0 && totalPackaging !== totalProducts) {
        toast({
          title: "Packaging Quantity Mismatch",
          description: `Total packaging quantity (${totalPackaging}) must equal total product quantity (${totalProducts})`,
          variant: "destructive",
        });
        return false;
      }

      // 2. Check packaging meets company MOQ requirement
      if (totalPackaging < packagingMOQ) {
        toast({
          title: "Company Packaging MOQ Requirement",
          description: `Total packaging minimum order is ${packagingMOQ} pieces${hasAddons ? ' (with addons)' : ' (without addons)'}. You have ${totalPackaging} pieces.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // If products are selected but no packaging, check if packaging is necessary
    if (totalProducts > 0 && !hasPackaging && companySettings.packaging_necessary) {
      toast({
        title: "Packaging Required",
        description: "Packaging selection is required when ordering products.",
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
    const isAddon = type === 'addon';
    const isPackaging = type === 'packaging';
    
    // For packaging, calculate auto quantity based on total products
    const totalProducts = localProducts
      .filter(p => p.type === 'product')
      .reduce((sum, p) => sum + p.quantity, 0);

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
              <span className="font-medium">{formatCurrency(item.price)}</span>
            </div>
            {!isAddon && (
              <div className="flex justify-between">
                <span>{isPackaging ? "Per Unit:" : "Min MOQ:"}</span>
                <span className="font-medium">{isPackaging ? "1 piece" : `${minQuantity} pieces`}</span>
              </div>
            )}
            {isPackaging && (
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1 text-blue-600">
                  <RefreshCw className="h-3 w-3" />
                  Auto-synced:
                </span>
                <span className="font-medium text-blue-600">= Total products ({totalProducts})</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            {isAddon ? (
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select:</Label>
                <input
                  type="checkbox"
                  checked={quantity > 0}
                  onChange={(e) => updateQuantity(item.id, type, e.target.checked ? 1 : 0)}
                  className="h-4 w-4"
                />
              </div>
            ) : isPackaging ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Add to Order:</Label>
                  <input
                    type="checkbox"
                    checked={quantity > 0}
                    onChange={(e) => {
                      if (e.target.checked && totalProducts > 0) {
                        updateQuantity(item.id, type, totalProducts);
                      } else {
                        updateQuantity(item.id, type, 0);
                      }
                    }}
                    disabled={totalProducts === 0}
                    className="h-4 w-4"
                  />
                </div>
                {totalProducts === 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Add products first
                  </div>
                )}
                {quantity > 0 && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Auto-synced to {totalProducts} pieces
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Quantity:</Label>
                <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors"
                    onClick={() => handleQuantityDecrease(item, type)}
                    disabled={quantity <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="min-w-[3rem] px-2 py-1 text-center text-sm font-medium bg-card text-card-foreground rounded border border-input">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-primary/10 transition-colors"
                    onClick={() => handleQuantityIncrease(item, type)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {isPackaging && quantity > 0 && (
            <div className="mt-2 text-xs text-center text-muted-foreground bg-muted/50 rounded p-1">
              Quantity: {totalProducts} pieces
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculate current totals for display
  const totalProducts = localProducts
    .filter(p => p.type === 'product')
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalPackaging = localProducts
    .filter(p => p.type === 'packaging')
    .reduce((sum, p) => sum + p.quantity, 0);
  const hasAddons = localProducts.some(p => p.type === 'addon');
  const requiredProductMOQ = companySettings ? (hasAddons ? companySettings.products_moq_with_addon : companySettings.products_moq_without_addon) : 0;
  const requiredPackagingMOQ = companySettings ? (hasAddons ? companySettings.packaging_moq_with_addon : companySettings.packaging_moq_without_addon) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Products & Services</h2>
        <p className="text-muted-foreground">
          Choose your products, packaging, and add-ons. MOQ rules apply.
        </p>
      </div>

      {/* Current Order Summary */}
      {(totalProducts > 0 || totalPackaging > 0) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Current Order Summary</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Products Status */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Products:</span>
                    <span className="font-medium">{totalProducts} pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required MOQ:</span>
                    <span className="font-medium">{requiredProductMOQ} pieces {hasAddons ? '(with addons)' : '(without addons)'}</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded text-center ${totalProducts >= requiredProductMOQ ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
                    {totalProducts >= requiredProductMOQ ? (
                      <span className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Products MOQ Met
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Need {requiredProductMOQ - totalProducts} more products
                      </span>
                    )}
                  </div>
                </div>

                {/* Packaging Status */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Packaging:</span>
                    <span className="font-medium">{totalPackaging} pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required MOQ:</span>
                    <span className="font-medium">{requiredPackagingMOQ} pieces {hasAddons ? '(with addons)' : '(without addons)'}</span>
                  </div>
                  {totalPackaging > 0 && (
                    <div className={`text-xs px-2 py-1 rounded text-center ${totalPackaging >= requiredPackagingMOQ && totalPackaging === totalProducts ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
                      {totalPackaging >= requiredPackagingMOQ && totalPackaging === totalProducts ? (
                        <span className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Packaging Requirements Met
                        </span>
                      ) : totalPackaging !== totalProducts ? (
                        <span className="flex items-center justify-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Packaging must equal product quantity ({totalProducts})
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Need {requiredPackagingMOQ - totalPackaging} more packaging
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Addon Status */}
              {hasAddons && (
                <div className="text-xs text-center bg-green-50 text-green-700 px-2 py-1 rounded">
                  🎉 Add-on selected - Reduced MOQ active! (From {companySettings?.products_moq_without_addon} to {companySettings?.products_moq_with_addon} pieces)
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            Packaging
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </h3>
          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            Auto-syncs with products ({totalProducts} pieces each)
          </div>
        </div>
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
        
        {/* Addon Benefits Information */}
        {companySettings && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                  💡
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Add-on Benefits</h4>
                  <p className="text-sm text-green-700">
                    Adding any add-on reduces your minimum order requirement from{' '}
                    <span className="font-semibold">{companySettings.products_moq_without_addon} pieces</span> to{' '}
                    <span className="font-semibold">{companySettings.products_moq_with_addon} pieces</span>!
                  </p>
                  {hasAddons && (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      ✅ Add-on selected - reduced MOQ active!
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MOQ Information */}
      {companySettings && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              📋 Order Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="space-y-2">
              <div className="font-medium">Individual Product MOQ:</div>
              <div className="text-muted-foreground ml-4">Each product has its own minimum order quantity (shown on product cards)</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Company Total MOQ:</div>
              <div className="text-muted-foreground ml-4">
                • Products without Add-ons: {companySettings.products_moq_without_addon} pieces
              </div>
              <div className="text-muted-foreground ml-4">
                • Products with Add-ons: {companySettings.products_moq_with_addon} pieces
              </div>
              <div className="text-muted-foreground ml-4">
                • Packaging without Add-ons: {companySettings.packaging_moq_without_addon} pieces
              </div>
              <div className="text-muted-foreground ml-4">
                • Packaging with Add-ons: {companySettings.packaging_moq_with_addon} pieces
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Packaging Logic:</div>
              <div className="text-muted-foreground ml-4">
                Each packaging item quantity automatically equals your total product quantity
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button variant="secondary" onClick={onBack} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleContinue} className="flex items-center gap-2 w-full sm:w-auto">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductSelection;