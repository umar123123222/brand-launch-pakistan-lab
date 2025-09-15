import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Plus, Minus, CheckCircle, AlertCircle, RefreshCw, Package, Box, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [currentPackagingPage, setCurrentPackagingPage] = useState(0);
  const [currentAddonPage, setCurrentAddonPage] = useState(0);
  
  const ITEMS_PER_PAGE = 6; // 3 columns x 2 rows

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
        .select("products_moq_without_addon, products_moq_with_addon, packaging_moq_without_addon, packaging_moq_with_addon, packaging_necessary, currency")
        .limit(1)
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

  const getTotalProducts = () => {
    return localProducts
      .filter(p => p.type === 'product')
      .reduce((sum, p) => sum + p.quantity, 0);
  };

  const getTotalPackaging = () => {
    return localProducts
      .filter(p => p.type === 'packaging')
      .reduce((sum, p) => sum + p.quantity, 0);
  };

  const canContinue = localProducts.length > 0;
  const autoSyncPackaging = true; // Based on the auto-sync logic in the original
  const isLoading = productsLoading || packagingLoading || addonsLoading;

  // Pagination helper functions
  const getPaginatedItems = (items: any[], currentPage: number) => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return items?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil((items?.length || 0) / ITEMS_PER_PAGE);
  };

  const renderPaginationControls = (
    currentPage: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    label: string
  ) => {
    const totalPages = getTotalPages({ length: totalItems } as any[]);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <span className="text-xs text-muted-foreground/60">
            ({Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalItems)} of {totalItems} {label})
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-card/30 via-background/50 to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground">Loading premium products...</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Please wait while we fetch the best options for you</p>
        </div>
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
      <Card key={`${type}-${item.id}`} className="group h-full bg-card/70 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02] hover:bg-card/80 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
            {item.image_url || (item.images && item.images[0]) ? (
              <img
                src={item.image_url || item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5">
                <Package className="h-20 w-20 text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h4 className="font-bold text-card-foreground text-xl mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                {item.name}
              </h4>
              {item.description && (
                <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <span className="text-base font-medium text-muted-foreground whitespace-nowrap">Price per unit:</span>
              <span className="font-bold text-xl text-primary whitespace-nowrap">
                {formatCurrency(item.price)}
              </span>
            </div>

            {!isAddon && (
              <div className="flex items-center justify-between mb-6 p-3 bg-muted/10 rounded-lg">
                <span className="text-base text-muted-foreground whitespace-nowrap">{isPackaging ? "Per Unit:" : "Min MOQ:"}</span>
                <span className="font-medium text-card-foreground text-base whitespace-nowrap">{isPackaging ? "1 piece" : `${minQuantity} pieces`}</span>
              </div>
            )}

            {isPackaging && (
              <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <span className="flex items-center gap-2 text-base text-accent font-medium whitespace-nowrap">
                  <RefreshCw className="h-4 w-4" />
                  Auto-synced:
                </span>
                <span className="font-bold text-base text-accent whitespace-nowrap">= Total products ({totalProducts})</span>
              </div>
            )}

            <div className="mt-6">
              {isAddon ? (
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold text-card-foreground whitespace-nowrap">Select Add-on:</Label>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={quantity > 0}
                      onChange={(e) => updateQuantity(item.id, type, e.target.checked ? 1 : 0)}
                      className="h-5 w-5 rounded border-2 border-primary/20 text-primary focus:ring-primary/20 focus:ring-2"
                    />
                  </div>
                </div>
              ) : isPackaging ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold text-card-foreground whitespace-nowrap">Add to Order:</Label>
                    <div className="relative">
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
                        className="h-5 w-5 rounded border-2 border-primary/20 text-primary focus:ring-primary/20 focus:ring-2 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {totalProducts === 0 && (
                    <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg flex items-center gap-2 border border-amber-200">
                      <AlertCircle className="h-4 w-4" />
                      Add products first to enable packaging
                    </div>
                  )}
                  {quantity > 0 && (
                    <div className="text-sm text-accent bg-accent/10 px-3 py-2 rounded-lg flex items-center gap-2 border border-accent/20">
                      <RefreshCw className="h-4 w-4" />
                      Auto-synced to {totalProducts} pieces
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold text-card-foreground whitespace-nowrap">Quantity:</Label>
                  <div className="flex items-center bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-xl overflow-hidden shadow-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary border-r border-primary/10 rounded-none transition-all duration-200"
                      onClick={() => handleQuantityDecrease(item, type)}
                      disabled={quantity <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = Math.max(0, parseInt(e.target.value) || 0);
                        updateQuantity(item.id, type, newQuantity);
                      }}
                      className="h-10 w-20 text-center border-0 bg-transparent font-bold text-card-foreground focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary border-l border-primary/10 rounded-none transition-all duration-200"
                      onClick={() => handleQuantityIncrease(item, type)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-card/30 via-background/50 to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-[2000px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Select Your Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose from our premium {selectedCategory} collection - each product comes with flexible packaging options and premium add-ons
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Enhanced Products Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Premium Products</h3>
            {products && products.length > ITEMS_PER_PAGE && (
              <div className="ml-auto text-sm text-muted-foreground">
                {products.length} products available
              </div>
            )}
          </div>
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16">
                {getPaginatedItems(products, currentProductPage).map((product) => renderItemCard(product, 'product'))}
              </div>
              {renderPaginationControls(
                currentProductPage,
                products.length,
                setCurrentProductPage,
                'products'
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
              <Package className="mx-auto h-16 w-16 mb-6 text-muted-foreground/60" />
              <p className="text-lg text-muted-foreground">No products available for this category.</p>
            </div>
          )}
        </div>

        {/* Enhanced Packaging Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl">
              <Box className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Professional Packaging</h3>
            {autoSyncPackaging && (
              <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                ✨ Auto-synced with products
              </div>
            )}
            {packaging && packaging.length > ITEMS_PER_PAGE && (
              <div className="ml-auto text-sm text-muted-foreground">
                {packaging.length} options available
              </div>
            )}
          </div>
          {packaging && packaging.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16">
                {getPaginatedItems(packaging, currentPackagingPage).map((pack) => renderItemCard(pack, 'packaging'))}
              </div>
              {renderPaginationControls(
                currentPackagingPage,
                packaging.length,
                setCurrentPackagingPage,
                'packaging options'
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
              <Box className="mx-auto h-16 w-16 mb-6 text-muted-foreground/60" />
              <p className="text-lg text-muted-foreground">No packaging options available for this category.</p>
            </div>
          )}
        </div>

        {/* Enhanced Add-ons Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl">
              <Plus className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Premium Add-ons</h3>
            {addons && addons.length > ITEMS_PER_PAGE && (
              <div className="ml-auto text-sm text-muted-foreground">
                {addons.length} add-ons available
              </div>
            )}
          </div>
          {addons && addons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16">
                {getPaginatedItems(addons, currentAddonPage).map((addon) => renderItemCard(addon, 'addon'))}
              </div>
              {renderPaginationControls(
                currentAddonPage,
                addons.length,
                setCurrentAddonPage,
                'add-ons'
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
              <Plus className="mx-auto h-16 w-16 mb-6 text-muted-foreground/60" />
              <p className="text-lg text-muted-foreground">No add-ons available for this category.</p>
            </div>
          )}
        </div>

        {/* Enhanced Order Summary */}
        {(getTotalProducts() > 0 || getTotalPackaging() > 0) && (
          <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm p-8 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Order Summary</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              {getTotalProducts() > 0 && (
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
                  <span className="text-card-foreground font-medium">Total Products:</span>
                  <span className="font-bold text-xl text-primary">{getTotalProducts()}</span>
                </div>
              )}
              {getTotalPackaging() > 0 && (
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/10">
                  <span className="text-card-foreground font-medium">Total Packaging:</span>
                  <span className="font-bold text-xl text-accent">{getTotalPackaging()}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                MOQ Requirements
              </div>
              {companySettings?.products_moq_without_addon && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/50 to-background/30">
                  {getTotalProducts() >= companySettings.products_moq_without_addon ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${getTotalProducts() >= companySettings.products_moq_without_addon ? "text-green-600" : "text-red-600"}`}>
                    Products MOQ: {getTotalProducts()}/{companySettings.products_moq_without_addon}
                  </span>
                </div>
              )}
              {companySettings?.packaging_moq_without_addon && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-background/50 to-background/30">
                  {getTotalPackaging() >= companySettings.packaging_moq_without_addon ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${getTotalPackaging() >= companySettings.packaging_moq_without_addon ? "text-green-600" : "text-red-600"}`}>
                    Packaging MOQ: {getTotalPackaging()}/{companySettings.packaging_moq_without_addon}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-3 px-8 py-3 text-base font-medium border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Categories
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="flex items-center gap-3 px-8 py-3 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Details
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;