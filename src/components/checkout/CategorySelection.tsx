import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategorySelectionProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onNext: () => void;
}

const CategorySelection = ({ selectedCategory, onCategorySelect, onNext }: CategorySelectionProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and set up real-time updates
  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching categories...");
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        
        console.log("Categories response:", { data, error });
        
        if (error) {
          console.error("Categories fetch error:", error);
          setError(error.message);
        } else {
          console.log("Categories fetched successfully:", data);
          setCategories(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    // Set up real-time subscription
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('Category change detected:', payload);
          fetchCategories(); // Refetch categories on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  console.log("CategorySelection render:", { categories, isLoading, error });

  const handleContinue = () => {
    if (selectedCategory) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">Error loading categories</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Choose Your Category</h2>
        <p className="text-muted-foreground">
          Select a category to view available products, packaging, and add-ons
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedCategory === category.name
                ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                : "hover:border-primary/50 border-border"
            }`}
            onClick={() => onCategorySelect(category.name)}
          >
            <CardContent className="p-6">
              <div className="aspect-square mb-4 bg-muted rounded-xl overflow-hidden shadow-inner">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={`${category.name} category`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load image for ${category.name}:`, category.image_url);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', 
                        `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                          <span class="text-3xl font-bold text-primary/60">${category.name.charAt(0).toUpperCase()}</span>
                        </div>`
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <span className="text-3xl font-bold text-primary/60">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center text-card-foreground text-lg mt-2 min-h-[28px] flex items-center justify-center">
                {category.name}
              </h3>
              {selectedCategory === category.name && (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    Selected
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedCategory}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySelection;